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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.demetrious.watchlist.adapter.rest.dto.InfoRsDto;
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
        return animeService.getAnimes();
    }

    @PostMapping("/import/shikimori")
    public List<Anime> importAnimesFromShikimori(@RequestParam String shikimoriNickname) {
        List<Anime> animeList = animeService.importShikimoriAnimes(shikimoriNickname);

        log.info("importAnimesFromShikimori: {}", animeList);
        return animeService.getAnimes();
    }

    @PostMapping("/export/yandex")
    public ResponseEntity<?> exportAnimesToYandex(@RequestHeader(name = "Authorization") String accessToken) {
        try {
            String animesFile = animeService.exportAnimesToYandex(accessToken);

            log.info("exportAnimesToYandex: \"{}\"", animesFile);
        } catch (Exception e) {
            log.error("Can't export animes to yandex", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public List<Anime> deleteAnimes(@RequestBody List<UUID> uuidList) {
        List<Anime> animeListDeleted = animeService.deleteAnimes(uuidList);

        log.info("deleteAnimes: {}", animeListDeleted);
        return animeService.getAnimes();
    }

    @PostMapping("/open/url")
    public ResponseEntity<String> openAnimeUrl(@RequestParam UUID id) {
        try {
            animeService.openAnimeUrl(id);
            log.info("openAnimeUrl: {}", id);
        } catch (Exception e) {
            log.error("Can't open Anime url:", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/save")
    public List<Anime> saveAnime(@RequestBody Anime anime) {
        Anime animeSaved = animeService.saveAnime(anime);

        log.info("saveAnime: {}", animeSaved);
        return animeService.getAnimes();
    }

    @PostMapping("/copy/name")
    public ResponseEntity<String> copyAnimeName(@RequestParam UUID id) {
        try {
            String animeName = animeService.copyAnimeName(id);

            log.info("copyAnimeName: {}", id);
            return ResponseEntity.ok(animeName);
        } catch (Exception e) {
            log.error("Can't copy Anime name:", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/shuffle")
    public ResponseEntity<?> getShuffleIndexes() {
        try {
            List<UUID> shuffleIndexes = animeService.getShuffleIndexes();

            log.info("getShuffleIndexes: {}", shuffleIndexes);
            return ResponseEntity.ok(shuffleIndexes);
        } catch (Exception e) {
            log.error("Can't shuffle indexes:", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/pick")
    public ResponseEntity<?> pickCandidates() {
        try {
            List<UUID> pickedAnimeList = animeService.pickCandidates();

            log.info("pickCandidates: {}", pickedAnimeList);
            return ResponseEntity.ok(pickedAnimeList);
        } catch (Exception e) {
            log.error("Can't pick candidates:", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/randomize")
    public ResponseEntity<?> randomizeWatching() {
        try {
            List<String> randomizedAnimeList = animeService.randomizeWatching();

            log.info("randomizeWatching: {}", randomizedAnimeList);
            return ResponseEntity.ok(randomizedAnimeList);
        } catch (Exception e) {
            log.error("Can't randomize watching:", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/info")
    public InfoRsDto getInfo() {
        InfoRsDto info = animeService.getInfo();

        log.info("getInfo: {}", info);
        return info;
    }
}
