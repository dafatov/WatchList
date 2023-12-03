package ru.demetrious.watchlist.feign;

import java.util.Optional;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import ru.demetrious.watchlist.feign.dto.LinkDto;
import ru.demetrious.watchlist.feign.dto.ResourceDto;

@FeignClient(value = "yandex-api", url = "${yandex.api.url}", dismiss404 = true)
public interface YandexClient {
    @GetMapping("/disk/resources/upload")
    LinkDto getUploadLink(
        @RequestHeader(name = "Authorization") String accessToken,
        @RequestParam(name = "path") String path,
        @RequestParam(name = "overwrite", required = false) Boolean overwrite
    );

    @GetMapping("/disk/resources")
    Optional<ResourceDto> getPathMetadata(
        @RequestHeader(name = "Authorization") String accessToken,
        @RequestParam(name = "path") String path
    );

    @PutMapping("/disk/resources")
    LinkDto createFolder(
        @RequestHeader(name = "Authorization") String accessToken,
        @RequestParam(name = "path") String path
    );
}
