package ru.demetrious.watchlist.service;

import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.demetrious.watchlist.adapter.rest.dto.FileManagerProgressRsDto;
import ru.demetrious.watchlist.manager.FileManager;
import ru.demetrious.watchlist.utils.AnimeUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {
    private static final Path TARGET_FOLDER = Path.of("\\\\Router\\Universe\\Torrents\\Main\\New Folder\\.Test");

    private final FileManager fileManager;
    private final AnimeService animeService;

    public void generate() {
        List<Path> pathList = animeService.getAnimes().stream()
            .filter(AnimeUtils::isWatching)
            .map(AnimeUtils::getPath)
            .toList();

        fileManager.checkIsRunnable(pathList);

        ExecutorService executorService = Executors.newSingleThreadExecutor();

        executorService.submit(() -> {
            try {
                List<Path> removablePathList = fileManager.getSubPathList(TARGET_FOLDER).stream()
                    .filter(targetPath -> pathList.stream().noneMatch(path -> path.getFileName().equals(targetPath.getFileName())))
                    .toList();

                fileManager.deleteDirectories(removablePathList);
                fileManager.copyDirectories(pathList, TARGET_FOLDER);
            } catch (Exception e) {
                log.error("Can't generate cause: {}", String.valueOf(e));
                e.printStackTrace();
            }

            executorService.shutdown();
        });
    }

    public void reset() {
        fileManager.reset();
    }

    public void stop() {
        fileManager.stop();
    }

    public FileManagerProgressRsDto getProgress() {
        return fileManager.getProgress();
    }
}
