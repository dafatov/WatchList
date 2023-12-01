package ru.demetrious.watchlist.feign;

import java.util.Optional;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import ru.demetrious.watchlist.feign.dto.AnimeListDto;
import ru.demetrious.watchlist.feign.dto.UserDto;

@FeignClient(value = "shikimori-api", url = "${shikimori.api.url}", dismiss404 = true)
public interface ShikimoriClient {
    @GetMapping(value = "/{nickname}/list_export/animes.xml")
    AnimeListDto getAnimes(@PathVariable(name = "nickname") String nickname);

    @GetMapping(value = "/api/users/{nickname}")
    Optional<UserDto> getUserByNickname(@PathVariable(name = "nickname") String nickname);
}
