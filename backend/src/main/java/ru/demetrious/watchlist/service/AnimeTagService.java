package ru.demetrious.watchlist.service;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.demetrious.watchlist.domain.model.anime.AnimeTag;
import ru.demetrious.watchlist.repository.AnimeTagRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnimeTagService {
    private final AnimeTagRepository animeTagRepository;
    private final AnimeTagGroupService animeTagGroupService;

    @Transactional
    public List<AnimeTag> getAnimeTags() {
        deleteAllIsUnused();
        return animeTagRepository.findAll();
    }

    // ===================================================================================================================
    // = Implementation
    // ===================================================================================================================

    private void deleteAllIsUnused() {
        List<UUID> unusedAnimeTagUuidList = animeTagRepository.findAll().stream()
            .filter(animeTag -> animeTag.getAnimes().isEmpty())
            .map(AnimeTag::getId)
            .collect(Collectors.toList());

        animeTagRepository.deleteByIdIsIn(unusedAnimeTagUuidList);
        log.info("deleteAllIsUnused: {}", unusedAnimeTagUuidList);
        animeTagGroupService.deleteAllIsUnused();
    }
}
