package ru.demetrious.watchlist.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.demetrious.watchlist.feign.ShikimoriClient;
import ru.demetrious.watchlist.feign.dto.AnimeDto;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShikimoriService {
    private final ShikimoriClient shikimoriClient;

    public Boolean isUserExist(String nickname) {
        return shikimoriClient.getUserByNickname(nickname).isPresent();
    }

    public List<AnimeDto> getAnimeList(String nickname) {
        return shikimoriClient.getAnimes(nickname).getAnime();
    }
}
