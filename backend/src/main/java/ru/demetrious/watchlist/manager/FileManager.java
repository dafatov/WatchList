package ru.demetrious.watchlist.manager;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Component;
import ru.demetrious.watchlist.adapter.rest.dto.FilesGroupsRqDto;
import ru.demetrious.watchlist.adapter.rest.dto.FilesRsDto;
import ru.demetrious.watchlist.adapter.rest.dto.ProgressRsDto;
import ru.demetrious.watchlist.domain.enums.FileManagerStatusEnum;
import ru.demetrious.watchlist.domain.model.Anime;
import ru.demetrious.watchlist.domain.model.anime.AnimeSupplement;

import static java.lang.Math.ceilDivExact;
import static java.lang.Math.floorDivExact;
import static java.lang.Math.toIntExact;
import static java.lang.System.currentTimeMillis;
import static java.util.Objects.requireNonNull;
import static java.util.Optional.ofNullable;
import static java.util.stream.Collectors.toList;
import static java.util.stream.IntStream.range;
import static org.apache.commons.collections4.CollectionUtils.collate;
import static org.apache.commons.io.FileUtils.forceDelete;
import static org.apache.commons.io.FileUtils.sizeOfDirectory;
import static ru.demetrious.watchlist.domain.enums.AnimeSupplementEnum.HAS_VOICE;
import static ru.demetrious.watchlist.domain.enums.AnimeSupplementEnum.NO_SUBS;
import static ru.demetrious.watchlist.domain.enums.FileManagerStatusEnum.COMPLETED;
import static ru.demetrious.watchlist.domain.enums.FileManagerStatusEnum.IDLE;
import static ru.demetrious.watchlist.domain.enums.FileManagerStatusEnum.INTERRUPTED;
import static ru.demetrious.watchlist.domain.enums.FileManagerStatusEnum.RUNNING;
import static ru.demetrious.watchlist.utils.FileUtils.copyDirectory;
import static ru.demetrious.watchlist.utils.FileUtils.normalizePaths;

@RequiredArgsConstructor
@Component
@Slf4j
public final class FileManager {
    public static final int BUFFER_SIZE = 32768;
    private static final String FILE_MANAGER_IS_ALREADY_RUNNING = "File manager is already running";
    private static final String FILE_MANAGER_IS_NOT_RUNNING = "File manager is not running";
    private static final String NO_PATHS_TO_OPERATE = "No paths to operate";

    private final AtomicLong currentSize = new AtomicLong(0);
    private final AtomicLong currentFileSize = new AtomicLong(0);
    private final AtomicLong allSize = new AtomicLong(0);
    private final AtomicReference<List<Path>> completedFiles = new AtomicReference<>(List.of());
    private final AtomicReference<Path> copingFile = new AtomicReference<>(null);
    private final AtomicBoolean isRunning = new AtomicBoolean(false);
    private final AtomicBoolean isCompleted = new AtomicBoolean(false);
    private final AtomicBoolean isInterrupted = new AtomicBoolean(false);

    private Pair<Long, Long> previousCurrentSize = Pair.of(0L, 0L);

    public void copyDirectories(List<Path> sources, Path target) throws IllegalStateException {
        try {
            checkIsRunnable(sources);

            allSize.set(sources.stream().reduce(0L, (accumulator, source) -> accumulator + sizeOfDirectory(source.toFile()), Long::sum));
            isRunning.compareAndSet(false, true);
            for (Path source : sources) {
                if (isInterrupted.get()) {
                    break;
                }

                copyDirectory(
                    isInterrupted,
                    source.toFile(),
                    Path.of(target.toString(), source.getFileName().toString()).toFile(),
                    this::addSize,
                    this::fileCopyStart,
                    this::fileCopyComplete
                );
            }
        } catch (Exception e) {
            isInterrupted.set(true);
            log.error(e.getMessage());
            throw new IllegalStateException(e);
        } finally {
            isRunning.compareAndSet(true, false);
            if (!isInterrupted.get()) {
                isCompleted.compareAndSet(false, true);
            }
        }
    }

    public void deleteDirectories(List<Path> targetList) throws IllegalStateException {
        try {
            for (Path target : targetList) {
                forceDelete(target.toFile());
            }
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }

    public List<Path> getSubPathList(Path target) {
        if (!target.toFile().exists()) {
            return List.of();
        }

        return Arrays.stream(requireNonNull(target.toFile().list()))
            .map(fileName -> Path.of(target.toString(), fileName))
            .collect(toList());
    }

    public ProgressRsDto getProgress() {
        ProgressRsDto progressRsDto = new ProgressRsDto()
            .setStatus(getStatus());

        if (!isNotRunnable()) {
            return progressRsDto;
        }

        Optional<Path> coping = ofNullable(copingFile.get());
        FilesRsDto completed = getFiles(completedFiles.get());
        long current = currentSize.get();
        long currentFile = currentFileSize.get();
        long all = allSize.get();
        long allFile = coping
            .map(Path::toFile)
            .map(File::length)
            .orElse(0L);
        int percent = getPercent(current, all);
        int percentFile = getPercent(currentFile, allFile);
        long currentTimeMillis = currentTimeMillis();
        long speed = floorDivExact(
            current - previousCurrentSize.getLeft(),
            ceilDivExact(currentTimeMillis - previousCurrentSize.getRight(), 1000)
        );

        previousCurrentSize = Pair.of(current, currentTimeMillis);

        return progressRsDto
            .setFullProgress(new ProgressRsDto.ProgressPart()
                .setAllSize(all)
                .setCurrentSize(current)
                .setPercent(percent))
            .setFileProgress(new ProgressRsDto.ProgressPart()
                .setAllSize(allFile)
                .setCurrentSize(currentFile)
                .setPercent(percentFile))
            .setSpeed(speed)
            .setCompleted(completed)
            .setCoping(coping
                .map(Path::toString)
                .orElse("-"));
    }

    public void reset() {
        if (isRunning.get()) {
            throw new IllegalStateException(FILE_MANAGER_IS_ALREADY_RUNNING);
        }

        isCompleted.compareAndSet(true, false);
        isInterrupted.compareAndSet(true, false);
        allSize.set(0);
        currentSize.set(0);
        completedFiles.set(List.of());
        currentFileSize.set(0);
        copingFile.set(null);
    }

    public void stop() {
        if (!isRunning.get()) {
            throw new IllegalStateException(FILE_MANAGER_IS_NOT_RUNNING);
        }

        isInterrupted.compareAndSet(false, true);
    }

    public Anime getAnimeDirectoryInfo(Path source, FilesGroupsRqDto filesGroups) {
        return new Anime()
            .setName(source.getFileName().toString())
            .setSize(sizeOfDirectory(source.toFile()))
            .setPath(source.toString())
            .setEpisodes(toIntExact(filesGroups.getFiles().getVideos().stream().filter(Objects::nonNull).count()))
            .setSupplements(getSupplements(filesGroups));
    }

    public FilesRsDto getFiles(List<Path> pathList) {
        Optional<Path> commonPathOptional = normalizePaths(pathList);

        if (commonPathOptional.isEmpty()) {
            return new FilesRsDto().setFiles(pathList.stream()
                .map(Path::toString)
                .collect(toList()));
        }

        return new FilesRsDto()
            .setCommonPath(commonPathOptional.get().toString())
            .setFiles(pathList.stream()
                .map(filePath -> relativize(commonPathOptional.get(), filePath))
                .collect(toList()));
    }

    // ===================================================================================================================
    // = Implementation
    // ===================================================================================================================

    private void checkIsRunnable(List<Path> pathList) {
        if (isNotRunnable()) {
            throw new IllegalStateException(FILE_MANAGER_IS_ALREADY_RUNNING);
        }

        if (pathList.size() < 1) {
            throw new IllegalStateException(NO_PATHS_TO_OPERATE);
        }
    }

    private boolean isNotRunnable() {
        return isRunning.get() || isCompleted.get() || isInterrupted.get();
    }

    private FileManagerStatusEnum getStatus() {
        if (isCompleted.get()) {
            return COMPLETED;
        }

        if (isInterrupted.get()) {
            return INTERRUPTED;
        }

        if (isRunning.get()) {
            return RUNNING;
        }

        return IDLE;
    }

    private void fileCopyComplete(File copingFile) {
        completedFiles.updateAndGet(accumulator -> collate(accumulator, List.of(copingFile.toPath())));
    }

    private void fileCopyStart(File copingFile) {
        this.copingFile.set(copingFile.toPath());
        currentFileSize.set(0);
    }

    private void addSize(Long delta) {
        currentSize.addAndGet(delta);
        currentFileSize.addAndGet(delta);
    }

    private String relativize(Path commonPath, Path filePath) {
        return "\\".concat(commonPath.relativize(filePath).toString());
    }

    private int getPercent(long current, long all) {
        if (all == 0) {
            return 0;
        }

        return toIntExact(floorDivExact(100 * current, all));
    }

    private List<AnimeSupplement> getSupplements(FilesGroupsRqDto filesGroups) {
        FilesGroupsRqDto.FilesRqDto files = filesGroups.getFiles();
        List<AnimeSupplement> animeSupplements = new ArrayList<>();

        if (files.getSubtitles().size() != files.getVoices().size()
            || files.getVideos().size() != files.getSubtitles().size()) {
            throw new IllegalStateException("Not equal size of fileGroups arrays");
        }

        if (files.getSubtitles().stream().anyMatch(Objects::isNull)) {
            animeSupplements.add(new AnimeSupplement()
                .setName(NO_SUBS)
                .setEpisodes(range(1, files.getSubtitles().size() + 1)
                    .filter(index -> files.getSubtitles().get(index - 1) == null)
                    .boxed()
                    .collect(toList())));
        }

        if (files.getVoices().stream().anyMatch(Objects::nonNull)) {
            animeSupplements.add(new AnimeSupplement()
                .setName(HAS_VOICE)
                .setEpisodes(range(1, files.getVoices().size() + 1)
                    .filter(index -> files.getVoices().get(index - 1) != null)
                    .boxed()
                    .collect(toList())));
        }

        return animeSupplements;
    }
}
