package ru.demetrious.watchlist.service;

import com.manoelcampos.randomorg.RandomOrgClient;
import java.awt.Desktop;
import java.awt.Toolkit;
import java.awt.datatransfer.StringSelection;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.demetrious.watchlist.adapter.rest.dto.InfoRsDto;
import ru.demetrious.watchlist.domain.model.Anime;
import ru.demetrious.watchlist.repository.AnimeRepository;

import static java.lang.Math.max;
import static org.apache.commons.lang3.ArrayUtils.contains;
import static ru.demetrious.watchlist.domain.enums.WatchStatusEnum.CANDIDATE;
import static ru.demetrious.watchlist.domain.enums.WatchStatusEnum.PLANNING;
import static ru.demetrious.watchlist.domain.enums.WatchStatusEnum.WATCHING;
import static ru.demetrious.watchlist.utils.AnimeUtils.getPath;
import static ru.demetrious.watchlist.utils.AnimeUtils.getURI;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnimeService {
    private static final int MAX_WATCHING = 7;
    private static final int[] CANDIDATES_COUNT = {0, 3, 5, 7, 11, 13, 17, 19};

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

        Desktop.getDesktop().open(getPath(anime.orElseThrow()).toFile());
    }

    public void openAnimeUrl(UUID id) throws IOException {
        Optional<Anime> anime = animeRepository.findById(id);

        System.setProperty("java.awt.headless", "false");

        Desktop.getDesktop().browse(getURI(anime.orElseThrow()));
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
        List<Anime> animeList = animeRepository.findAllByStatus(PLANNING);

        if (animeList.size() < 2) {
            throw new IllegalStateException("No at least 2 anime in status isPlanning");
        }

        int[] nonDuplicatedIntegers = randomOrgClient.generateNonDuplicatedIntegers(animeList.size(), 1, animeList.size());

        return animeList.stream()
            .collect(Collectors.toMap(
                Anime::getId,
                anime -> nonDuplicatedIntegers[animeList.indexOf(anime)]
            ));
    }

    public InfoRsDto getInfo() {
        int count = animeRepository.countByStatus(WATCHING);
        int candidatesNow = animeRepository.countByStatus(CANDIDATE);
        int remained = max(0, MAX_WATCHING - count);

        return new InfoRsDto()
            .setCount(count)
            .setRemained(remained)
            .setCandidates(CANDIDATES_COUNT[remained] - candidatesNow);
    }

    public List<UUID> pickCandidates() {
        InfoRsDto info = getInfo();

        if (info.getCandidates() != 0) {
            throw new IllegalStateException("Must be a " + info.getCandidates() + " more candidates");
        }

        List<Anime> animeList = animeRepository.findAllByStatus(CANDIDATE);
        int[] nonDuplicatedIntegers = randomOrgClient.generateNonDuplicatedIntegers(info.getRemained(), 0, animeList.size() - 1);

        return animeList.stream()
            .peek(anime -> anime.setStatus(contains(nonDuplicatedIntegers, animeList.indexOf(anime)) ? WATCHING : PLANNING))
            .filter(anime -> contains(nonDuplicatedIntegers, animeList.indexOf(anime)))
            .map(Anime::getId)
            .toList();
    }
}