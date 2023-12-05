package ru.demetrious.watchlist.service;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ru.demetrious.watchlist.domain.model.Anime;
import ru.demetrious.watchlist.feign.YandexClient;
import ru.demetrious.watchlist.feign.dto.ResourceDto;

import static java.lang.Math.max;
import static java.lang.Math.toIntExact;
import static java.nio.file.Path.of;
import static java.text.MessageFormat.format;
import static java.time.LocalDateTime.now;
import static java.time.format.DateTimeFormatter.ofPattern;
import static ru.demetrious.watchlist.utils.RestTemplateUtils.createHttpEntity;
import static ru.demetrious.watchlist.utils.RestTemplateUtils.getRestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class YandexService {
    private static final DateTimeFormatter DATE_TIME_FORMATTER = ofPattern("yyyy-MM-dd_hh-mm-ss");
    private static final int MAX_BACKUPS = 10;
    private static final Comparator<ResourceDto> RESOURCE_DTO_COMPARATOR = (a, b) ->
        toIntExact(a.getCreated().toEpochSecond() - b.getCreated().toEpochSecond());

    private final YandexClient yandexClient;

    @Value("${yandex.api.disk.app-folder}")
    private String APP_FOLDER;

    public String uploadAnimeList(String accessToken, List<Anime> animeList) {
        String backupsFolder = APP_FOLDER + "/backups";
        String animesFile = format(backupsFolder + "/animes_{0}.json", now().format(DATE_TIME_FORMATTER));

        createMissingFolders(accessToken, backupsFolder);

        getRestTemplate().postForEntity(
            yandexClient.getUploadLink(accessToken, animesFile, true).getHref(),
            createHttpEntity(animeList),
            String.class
        );
        yandexClient.getPathMetadata(accessToken, backupsFolder)
            .map(ResourceDto::get_embedded)
            .ifPresent(embedded -> embedded.getItems().stream()
                .sorted(RESOURCE_DTO_COMPARATOR)
                .limit(max(embedded.getItems().size() - MAX_BACKUPS, 0))
                .map(ResourceDto::getPath)
                .peek(path -> log.info("File \"{}\" will be deleted", path))
                .forEach(path -> yandexClient.deletePath(accessToken, path))
            );
        return animesFile;
    }

    // ===================================================================================================================
    // = Implementation
    // ===================================================================================================================

    private void createMissingFolders(String accessToken, String path) {
        if (yandexClient.getPathMetadata(accessToken, path).isEmpty()) {
            String parentPath = of(path).getParent().toString().replaceAll("\\\\", "/");
            createMissingFolders(accessToken, parentPath);
            yandexClient.createFolder(accessToken, path);
        }
    }
}
