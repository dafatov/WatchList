package ru.demetrious.watchlist.manager;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import ru.demetrious.watchlist.adapter.rest.dto.FileManagerProgressRsDto;
import ru.demetrious.watchlist.domain.enums.FileManagerStatusEnum;

import static java.lang.Math.ceilDivExact;
import static java.lang.Math.toIntExact;
import static java.util.Objects.requireNonNull;
import static org.apache.commons.collections4.CollectionUtils.collate;
import static org.apache.commons.io.FileUtils.deleteDirectory;
import static org.apache.commons.io.FileUtils.sizeOfDirectory;
import static ru.demetrious.watchlist.domain.enums.FileManagerStatusEnum.COMPLETED;
import static ru.demetrious.watchlist.domain.enums.FileManagerStatusEnum.IDLE;
import static ru.demetrious.watchlist.domain.enums.FileManagerStatusEnum.INTERRUPTED;
import static ru.demetrious.watchlist.domain.enums.FileManagerStatusEnum.RUNNING;
import static ru.demetrious.watchlist.utils.FileUtils.copyDirectory;
import static ru.demetrious.watchlist.utils.FileUtils.normalizePaths;

@RequiredArgsConstructor
@Component
public final class FileManager {
    public static final int BUFFER_SIZE = 1024;
    private static final String FILE_MANAGER_IS_ALREADY_RUNNING = "File manager is already running";
    private static final String FILE_MANAGER_IS_NOT_RUNNING = "File manager is not running";
    private static final String NO_PATHS_TO_OPERATE = "No paths to operate";

    private final AtomicLong currentSize = new AtomicLong(0);
    private final AtomicLong allSize = new AtomicLong(0);
    private final AtomicReference<List<Path>> completedFileSet = new AtomicReference<>(List.of());
    private final AtomicBoolean isRunning = new AtomicBoolean(false);
    private final AtomicBoolean isCompleted = new AtomicBoolean(false);
    private final AtomicBoolean isInterrupted = new AtomicBoolean(false);

    public void copyDirectories(List<Path> sources, Path target) throws IllegalStateException {
        checkIsRunnable(sources);

        allSize.set(sources.stream().reduce(0L, (accumulator, source) -> accumulator + sizeOfDirectory(source.toFile()), Long::sum));
        isRunning.compareAndSet(false, true);
        isCompleted.compareAndSet(true, false);
        try {
            for (Path source : sources) {
                if (isInterrupted.get()) {
                    break;
                }

                copyDirectory(
                    isInterrupted,
                    source.toFile(),
                    Path.of(target.toString(), source.getFileName().toString()).toFile(),
                    currentSize::addAndGet,
                    completedFile -> completedFileSet.updateAndGet(accumulator -> collate(accumulator, List.of(completedFile.toPath())))
                );
            }
        } catch (IOException e) {
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
                deleteDirectory(target.toFile());
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
            .collect(Collectors.toList());
    }

    public FileManagerProgressRsDto getProgress() {
        FileManagerProgressRsDto progressRsDto = new FileManagerProgressRsDto()
            .setStatus(getStatus());
        List<Path> pathList = completedFileSet.get();

        if (!isNotRunnable() || pathList.size() < 1) {
            return progressRsDto;
        }

        long current = currentSize.get();
        long all = allSize.get();
        Path commonPath = normalizePaths(pathList);

        return progressRsDto
            .setAllSize(all)
            .setCurrentSize(current)
            .setPercent(toIntExact(ceilDivExact(100 * current, all)))
            .setCommonPath(commonPath.toString())
            .setCompleted(pathList.stream()
                .map(commonPath::relativize)
                .map(Path::toString)
                .collect(Collectors.toList()));
    }

    public void reset() {
        if (isRunning.get()) {
            throw new IllegalStateException(FILE_MANAGER_IS_ALREADY_RUNNING);
        }

        isCompleted.compareAndSet(true, false);
        isInterrupted.compareAndSet(true, false);
        allSize.set(0);
        currentSize.set(0);
        completedFileSet.set(List.of());
    }

    public void stop() {
        if (!isRunning.get()) {
            throw new IllegalStateException(FILE_MANAGER_IS_NOT_RUNNING);
        }

        isInterrupted.compareAndSet(false, true);
    }

    public void checkIsRunnable(List<Path> pathList) {
        if (isNotRunnable()) {
            throw new IllegalStateException(FILE_MANAGER_IS_ALREADY_RUNNING);
        }

        if (pathList.size() < 1) {
            throw new IllegalStateException(NO_PATHS_TO_OPERATE);
        }
    }

    // ===================================================================================================================
    // = Implementation
    // ===================================================================================================================

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
}
