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
    private final FileManager fileManager;
    private final AnimeService animeService;
    private final ConfigService configService;

    public void generate() {
        Path targetFolder = Path.of(configService.getData("default-setting.file-service.target-folder"));
        List<Path> pathList = animeService.getAnimes().stream()
            .filter(AnimeUtils::isWatching)
            .map(AnimeUtils::getPath)
            .toList();

        fileManager.checkIsRunnable(pathList);

        ExecutorService executorService = Executors.newSingleThreadExecutor();

        executorService.submit(() -> {
            try {
                List<Path> removablePathList = fileManager.getSubPathList(targetFolder).stream()
                    .filter(targetPath -> pathList.stream().noneMatch(path -> path.getFileName().equals(targetPath.getFileName())))
                    .toList();

                fileManager.deleteDirectories(removablePathList);
                fileManager.copyDirectories(pathList, targetFolder);
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
