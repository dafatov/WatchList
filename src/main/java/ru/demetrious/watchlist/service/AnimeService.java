package ru.demetrious.watchlist.service;

import java.awt.Desktop;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import ru.demetrious.watchlist.domain.model.Anime;
import ru.demetrious.watchlist.repository.AnimeRepository;

@Component
@RequiredArgsConstructor
@Slf4j
public class AnimeService {
    private final AnimeRepository animeRepository;

    public List<Anime> getAnimes() {
        return animeRepository.findAll();
    }

    public List<Anime> addAnimes(List<Anime> animeList) {
        return animeRepository.saveAll(animeList);
    }

    public List<Anime> deleteAnimes(List<UUID> uuidList) {
        return animeRepository.deleteByIdIsIn(uuidList);
    }

    public void openAnime(UUID id) throws IOException {
        Optional<Anime> anime = animeRepository.findById(id);

        System.setProperty("java.awt.headless", "false");

        Desktop.getDesktop().open(new File(anime.orElseThrow().getPath()));
    }

    public Anime saveAnime(Anime anime) {
        validateAnime(anime);
        return animeRepository.save(anime);
    }

    // ===================================================================================================================
    // = Implementation
    // ===================================================================================================================

    private void validateAnime(Anime anime) {
        anime.setSupplements(anime.getSupplements().stream()
            .peek(animeSupplement -> animeSupplement
                .setEpisodes(animeSupplement.getEpisodes().stream()
                    .filter(episode -> episode <= anime.getEpisodes())
                    .collect(Collectors.toSet())))
            .filter(animeSupplement -> !animeSupplement.getEpisodes().isEmpty())
            .collect(Collectors.toSet()));
    }
}
