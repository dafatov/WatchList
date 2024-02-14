package ru.demetrious.watchlist.service;

import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import ru.demetrious.watchlist.domain.model.Anime;
import ru.demetrious.watchlist.feign.YandexClient;
import ru.demetrious.watchlist.feign.dto.ResourceDto;

import static java.lang.Math.max;
import static java.lang.Math.toIntExact;
import static java.net.URI.create;
import static java.nio.file.Path.of;
import static java.text.MessageFormat.format;
import static java.time.LocalDateTime.now;
import static java.time.format.DateTimeFormatter.ofPattern;
import static org.springframework.http.HttpEntity.EMPTY;
import static org.springframework.http.HttpMethod.GET;
import static ru.demetrious.watchlist.utils.RestTemplateUtils.createHttpEntity;
import static ru.demetrious.watchlist.utils.RestTemplateUtils.getRestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class YandexService {
    private static final DateTimeFormatter DATE_TIME_FORMATTER = ofPattern("yyyy-MM-dd_HH-mm-ss");
    private static final int MAX_BACKUPS = 10;
    private static final Comparator<ResourceDto> RESOURCE_DTO_COMPARATOR = (a, b) ->
        toIntExact(a.getCreated().toEpochSecond() - b.getCreated().toEpochSecond());

    private final YandexClient yandexClient;

    @Value("${yandex.api.disk.app-folder}/backups")
    private String BACKUPS_FOLDER;

    public String uploadAnimeList(String accessToken, List<Anime> animeList) {
        String animesFile = format(BACKUPS_FOLDER + "/animes_{0}.json", now().format(DATE_TIME_FORMATTER));

        createMissingFolders(accessToken, BACKUPS_FOLDER);

        getRestTemplate().postForEntity(
            yandexClient.getUploadLink(accessToken, animesFile, true).getHref(),
            createHttpEntity(animeList),
            String.class
        );
        yandexClient.getPathMetadata(accessToken, BACKUPS_FOLDER)
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

    public List<Anime> getLastAnimeList(String accessToken) {
        return yandexClient.getPathMetadata(accessToken, BACKUPS_FOLDER)
            .map(ResourceDto::get_embedded)
            .flatMap(embedded -> embedded.getItems().stream().min(RESOURCE_DTO_COMPARATOR))
            .map(ResourceDto::getPath)
            .map(path -> yandexClient.getAnimeList(accessToken, path))
            .map(link -> getRestTemplate().exchange(create(link.getHref()), GET, EMPTY, Anime[].class))
            .map(HttpEntity::getBody)
            .map(animeArray -> Arrays.stream(animeArray).toList())
            .orElse(List.of());
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
