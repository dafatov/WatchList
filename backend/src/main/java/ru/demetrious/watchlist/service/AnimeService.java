package ru.demetrious.watchlist.service;

import com.manoelcampos.randomorg.RandomOrgClient;
import java.awt.Desktop;
import java.awt.Toolkit;
import java.awt.datatransfer.StringSelection;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.demetrious.watchlist.adapter.rest.dto.InfoRsDto;
import ru.demetrious.watchlist.domain.model.Anime;
import ru.demetrious.watchlist.feign.ShikimoriClient;
import ru.demetrious.watchlist.mapper.AnimeMapper;
import ru.demetrious.watchlist.repository.AnimeRepository;

import static java.lang.Math.max;
import static java.nio.file.Path.of;
import static java.util.Arrays.stream;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang3.ArrayUtils.contains;
import static org.apache.commons.lang3.StringUtils.compare;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static ru.demetrious.watchlist.domain.enums.WatchStatusEnum.CANDIDATE;
import static ru.demetrious.watchlist.domain.enums.WatchStatusEnum.PLANNING;
import static ru.demetrious.watchlist.domain.enums.WatchStatusEnum.WATCHING;
import static ru.demetrious.watchlist.utils.AnimeUtils.getPath;
import static ru.demetrious.watchlist.utils.AnimeUtils.getURI;
import static ru.demetrious.watchlist.utils.FileUtils.normalizePaths;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnimeService {
    private static final int MAX_WATCHING = 7;
    private static final int[] CANDIDATES_COUNT = {0, 3, 5, 7, 11, 13, 17, 19};

    private final AnimeRepository animeRepository;
    private final RandomOrgClient randomOrgClient;
    private final ShikimoriClient shikimoriClient;
    private final AnimeMapper animeMapper;

    public List<Anime> getAnimes() {
        List<Anime> animeList = animeRepository.findAll();
        Optional<Path> commonPathOptional = normalizePaths(animeList.stream()
            .map(Anime::getPath)
            .filter(Objects::nonNull)
            .map(Path::of)
            .collect(toList()));

        return animeList.stream()
            .peek(anime -> anime.setPathPackage(getPathPackage(commonPathOptional, anime.getPath())))
            .collect(toList());
    }

    public List<Anime> setAnimes(List<Anime> animeList) {
        animeRepository.deleteAll();
        return animeRepository.saveAll(animeList);
    }

    public List<Anime> importShikimoriAnimes(String shikimoriNickname) {
        List<Anime> animeList = shikimoriClient.getAnimes(shikimoriNickname).getAnime().stream()
            .map(animeMapper::animeDtoToAnime)
            .toList();

        return setAnimes(animeList);
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

    public List<UUID> getShuffleIndexes() {
        List<Anime> animeList = animeRepository.findAllByStatus(PLANNING).stream()
            .sorted((a, b) -> compare(a.getName(), b.getName()))
            .toList();;

        if (animeList.size() < 2) {
            throw new IllegalStateException("No at least 2 anime in status isPlanning");
        }

        int[] nonDuplicatedIntegers = randomOrgClient.generateNonDuplicatedIntegers(animeList.size(), 0, animeList.size() - 1);

        return stream(nonDuplicatedIntegers)
            .boxed()
            .map(animeList::get)
            .map(Anime::getId)
            .collect(toList());
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

    public List<String> randomizeWatching() {
        List<Anime> animeList = animeRepository.findAllByStatus(WATCHING).stream()
            .sorted((a, b) -> compare(a.getName(), b.getName()))
            .toList();

        if (animeList.size() != MAX_WATCHING) {
            throw new IllegalStateException("Must be a " + MAX_WATCHING + " watching");
        }

        int[] nonDuplicatedIntegers = randomOrgClient.generateNonDuplicatedIntegers(MAX_WATCHING, 0, MAX_WATCHING - 1);

        return stream(nonDuplicatedIntegers)
            .mapToObj(animeList::get)
            .map(Anime::getName)
            .collect(toList());
    }

    // ===================================================================================================================
    // = Implementation
    // ===================================================================================================================

    private String getPathPackage(Optional<Path> commonPathOptional, String path) {
        if (isBlank(path)) {
            return path;
        }

        return commonPathOptional
            .map(commonPath -> commonPath.relativize(of(path)))
            .map(Path::getParent)
            .map(Path::toString)
            .map("\\"::concat)
            .orElse(path);
    }
}
