package ru.demetrious.watchlist.adapter.rest;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.demetrious.watchlist.domain.model.Anime;
import ru.demetrious.watchlist.service.AnimeService;

@RestController
@Transactional
@RequestMapping("/api/animes")
@RequiredArgsConstructor
@Slf4j
public class AnimeController {
    private final AnimeService animeService;

    @GetMapping
    public List<Anime> getAnimes() {
        List<Anime> animeList = animeService.getAnimes();
        log.info("getAnimes: {}", animeList);
        return animeList;
    }

    @PostMapping
    public List<Anime> setAnimes(@RequestBody List<Anime> animeList) {
        List<Anime> animeListSaved = animeService.setAnimes(animeList);
        log.info("setAnimes: {}", animeListSaved);
        return getAnimes();
    }

    @DeleteMapping
    public List<Anime> deleteAnimes(@RequestBody List<UUID> uuidList) {
        List<Anime> animeListDeleted = animeService.deleteAnimes(uuidList);
        log.info("deleteAnimes: {}", animeListDeleted);
        return getAnimes();
    }

    @PostMapping("/open/folder")
    public ResponseEntity<String> openAnimeFolder(@RequestParam UUID id) {
        try {
            animeService.openAnimeFolder(id);
            log.info("openAnimeFolder: {}", id);
        } catch (Exception e) {
            log.error("Can't open Anime folder: {}", String.valueOf(e));
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/open/url")
    public ResponseEntity<String> openAnimeUrl(@RequestParam UUID id) {
        try {
            animeService.openAnimeUrl(id);
            log.info("openAnimeUrl: {}", id);
        } catch (Exception e) {
            log.error("Can't open Anime url: {}", String.valueOf(e));
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/save")
    public List<Anime> saveAnime(@RequestBody Anime anime) {
        Anime animeSaved = animeService.saveAnime(anime);
        log.info("saveAnime: {}", animeSaved);
        return getAnimes();
    }
}
