package ru.demetrious.watchlist.service;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.demetrious.watchlist.domain.model.anime.AnimeTag;
import ru.demetrious.watchlist.domain.model.anime.AnimeTagGroup;
import ru.demetrious.watchlist.repository.AnimeTagGroupRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnimeTagGroupService {
    private final AnimeTagGroupRepository animeTagGroupRepository;

    public void deleteUnused(AnimeTagGroup animeTagGroup) {
        if (animeTagGroup.getTags().isEmpty()) {
            animeTagGroupRepository.deleteById(animeTagGroup.getId());
            log.info("deleteUnused: {}", animeTagGroup.getId());
        }
    }
}
