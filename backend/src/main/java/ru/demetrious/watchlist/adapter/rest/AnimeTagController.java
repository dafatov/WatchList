package ru.demetrious.watchlist.adapter.rest;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.demetrious.watchlist.domain.model.anime.AnimeTag;
import ru.demetrious.watchlist.service.AnimeTagService;

@RestController
@Transactional
@RequestMapping("/api/tags")
@RequiredArgsConstructor
@Slf4j
public class AnimeTagController {
    private final AnimeTagService animeTagService;

    @GetMapping
    public List<AnimeTag> getAnimeTags() {
        List<AnimeTag> animeTagList = animeTagService.getAnimeTags();

        log.info("getAnimeTags: {}", animeTagList);
        return animeTagList;
    }
}
