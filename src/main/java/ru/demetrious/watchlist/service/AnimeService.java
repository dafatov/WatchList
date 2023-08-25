package ru.demetrious.watchlist.service;

import com.manoelcampos.randomorg.RandomOrgClient;
import java.awt.Desktop;
import java.awt.Toolkit;
import java.awt.datatransfer.StringSelection;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import ru.demetrious.watchlist.adapter.rest.dto.InfoRsDto;
import ru.demetrious.watchlist.domain.enums.WatchStatusEnum;
import ru.demetrious.watchlist.domain.model.Anime;
import ru.demetrious.watchlist.repository.AnimeRepository;

@Component
@RequiredArgsConstructor
@Slf4j
public class AnimeService {
    private static final int MAX_WATCHING = 7;
    private static final int[] CANDIDATES_COUNT = {3, 5, 7, 11, 13, 17, 19};

    private final AnimeRepository animeRepository;
    private final RandomOrgClient randomOrgClient;

    public List<Anime> getAnimes() {
        return animeRepository.findAll();
    }

    public List<Anime> setAnimes(List<Anime> animeList) {
        animeRepository.deleteAll();
        return animeRepository.saveAll(animeList);
    }

    public List<Anime> deleteAnimes(List<UUID> uuidList) {
        return animeRepository.deleteByIdIsIn(uuidList);
    }

    public void openAnimeFolder(UUID id) throws IOException {
        Optional<Anime> anime = animeRepository.findById(id);

        System.setProperty("java.awt.headless", "false");

        Desktop.getDesktop().open(new File(anime.orElseThrow().getPath()));
    }

    public void openAnimeUrl(UUID id) throws IOException {
        Optional<Anime> anime = animeRepository.findById(id);

        System.setProperty("java.awt.headless", "false");

        Desktop.getDesktop().browse(URI.create(anime.orElseThrow().getUrl()));
    }

    public Anime saveAnime(Anime anime) {
        return animeRepository.save(anime);
    }

    public String copyAnimeName(UUID id) {
        Optional<Anime> anime = animeRepository.findById(id);
        String name = anime.orElseThrow().getName();

        System.setProperty("java.awt.headless", "false");

        Toolkit.getDefaultToolkit().getSystemClipboard().setContents(new StringSelection(name), null);
        return name;
    }

    public Map<UUID, Integer> getShuffleIndexes() {
        List<Anime> animeList = animeRepository.findAll().stream()
            .filter(anime -> WatchStatusEnum.PLANNING.equals(anime.getStatus()))
            .toList();
        int[] nonDuplicatedIntegers = randomOrgClient.generateNonDuplicatedIntegers(animeList.size(), 1, animeList.size());

        return animeList.stream()
            .collect(Collectors.toMap(
                Anime::getId,
                anime -> nonDuplicatedIntegers[animeList.indexOf(anime)]
            ));
    }

    public InfoRsDto getInfo() {
        List<Anime> animeList = animeRepository.findAll();
        int count = animeList.stream()
            .filter(anime -> WatchStatusEnum.WATCHING.equals(anime.getStatus()))
            .toList()
            .size();
        int remained = MAX_WATCHING - count;

        return new InfoRsDto()
            .setCount(count)
            .setRemained(remained)
            .setCandidates(CANDIDATES_COUNT[remained - 1]);
    }
}
