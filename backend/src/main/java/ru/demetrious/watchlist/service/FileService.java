package ru.demetrious.watchlist.service;

import java.awt.Desktop;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.ExecutorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.demetrious.watchlist.adapter.rest.dto.FileManagerProgressRsDto;
import ru.demetrious.watchlist.adapter.rest.dto.FilesGroupsRqDto;
import ru.demetrious.watchlist.adapter.rest.dto.FilesRsDto;
import ru.demetrious.watchlist.domain.model.Anime;
import ru.demetrious.watchlist.manager.FileManager;
import ru.demetrious.watchlist.utils.AnimeUtils;

import static java.nio.file.Path.of;
import static java.util.concurrent.Executors.newSingleThreadExecutor;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {
    private final FileManager fileManager;
    private final AnimeService animeService;
    private final ConfigService configService;

    public void generate() {
        ExecutorService executorService = newSingleThreadExecutor();
        Path targetFolder = of(configService.getData("default-setting.file-service.target-folder"));
        List<Path> pathList = animeService.getAnimes().stream()
            .filter(AnimeUtils::isWatching)
            .map(AnimeUtils::getPath)
            .toList();
        List<Path> removablePathList = fileManager.getSubPathList(targetFolder).stream()
            .filter(targetPath -> pathList.stream().noneMatch(path -> path.getFileName().equals(targetPath.getFileName())))
            .toList();

        try {
            executorService.submit(() -> {
                fileManager.deleteDirectories(removablePathList);
                fileManager.copyDirectories(pathList, targetFolder);

                executorService.shutdown();
            });
        } catch (Exception e) {
            executorService.close();
            throw new IllegalStateException(e);
        }
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

    public Anime getAnimeDirectoryInfo(String path, FilesGroupsRqDto filesGroups) {
        Path folder = of(path);

        filesGroups.acceptAll(fileList -> fileManager.renameFiles(folder, fileList));

        return fileManager.getAnimeDirectoryInfo(folder, filesGroups);
    }

    public void openFolder(String path) throws IOException {
        System.setProperty("java.awt.headless", "false");

        Desktop.getDesktop().open(of(path).toFile());
    }

    public FilesRsDto getFiles(String path) {
        List<Path> pathList = fileManager.getSubPathList(of(path)).stream()
            .filter(Files::isRegularFile)
            .toList();

        return fileManager.getFiles(pathList);
    }
}
