package ru.demetrious.watchlist.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.demetrious.watchlist.domain.model.anime.AnimeTag;

@Repository
public interface AnimeTagRepository extends JpaRepository<AnimeTag, UUID> {
}
