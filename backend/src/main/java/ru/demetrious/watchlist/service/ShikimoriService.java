package ru.demetrious.watchlist.service;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.demetrious.watchlist.adapter.rest.dto.ShikimoriUserRsDto;
import ru.demetrious.watchlist.feign.ShikimoriClient;
import ru.demetrious.watchlist.feign.dto.AnimeListDto.AnimeDto;
import ru.demetrious.watchlist.mapper.ShikimoriUserMapper;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShikimoriService {
    private final ShikimoriUserMapper shikimoriUserMapper;
    private final ShikimoriClient shikimoriClient;

    public Optional<ShikimoriUserRsDto> getUser(String nickname) {
        return shikimoriClient.getUserByNickname(nickname)
            .map(shikimoriUserMapper::userDtoToShikimoriUserRsDto);
    }

    public List<AnimeDto> getAnimeList(String nickname) {
        return shikimoriClient.getAnimes(nickname).getAnime();
    }
}
