package ru.demetrious.watchlist.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import ru.demetrious.watchlist.feign.dto.AnimeListDto;

@FeignClient(value = "shikimori-api", url = "${shikimori.api.url}")
public interface ShikimoriClient {
    @GetMapping(value = "/{shikimoriNickname}/list_export/animes.xml")
    AnimeListDto getAnimes(@PathVariable(name = "shikimoriNickname") String shikimoriNickname);
}
