package ru.demetrious.watchlist.service;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import ru.demetrious.watchlist.domain.model.Anime;
import ru.demetrious.watchlist.feign.YandexClient;
import ru.demetrious.watchlist.feign.dto.LinkDto;
import ru.demetrious.watchlist.feign.dto.ResourceDto;

import static ru.demetrious.watchlist.utils.RestTemplateUtils.getRestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class YandexService {
    private static final String BACKUPS_FOLDER = "/Приложения/WatchList/backups";
    private static final String ANIMES_FILE = BACKUPS_FOLDER + "/animes.json";

    private final YandexClient yandexClient;

    public void uploadAnimeList(String accessToken, List<Anime> animeList) {
        Optional<ResourceDto> pathMetadata = yandexClient.getPathMetadata(accessToken, BACKUPS_FOLDER);
        if (pathMetadata.isEmpty()) {
            yandexClient.createFolder(accessToken, BACKUPS_FOLDER);
        }

        LinkDto uploadLink = yandexClient.getUploadLink(accessToken, ANIMES_FILE, true);
        HttpHeaders headers = new HttpHeaders();
        MultiValueMap<String, List<Anime>> body = new LinkedMultiValueMap<>();

        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        body.add("file", animeList);

        getRestTemplate().postForEntity(uploadLink.getHref(), new HttpEntity<>(body, headers), String.class);
    }
}
