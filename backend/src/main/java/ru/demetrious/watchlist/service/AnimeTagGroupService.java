package ru.demetrious.watchlist.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.demetrious.watchlist.domain.model.anime.AnimeTagGroup;
import ru.demetrious.watchlist.repository.AnimeTagGroupRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnimeTagGroupService {
    private final AnimeTagGroupRepository animeTagGroupRepository;

    public void deleteAllIsUnused() {
        List<UUID> unusedAnimeTagGroupUuidList = animeTagGroupRepository.findAll().stream()
            .filter(animeTag -> animeTag.getTags().isEmpty())
            .map(AnimeTagGroup::getId)
            .collect(Collectors.toList());

        animeTagGroupRepository.deleteByIdIsIn(unusedAnimeTagGroupUuidList);
        log.info("deleteAllIsUnused: {}", unusedAnimeTagGroupUuidList);
    }
}
