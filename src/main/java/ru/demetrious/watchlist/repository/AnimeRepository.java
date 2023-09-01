package ru.demetrious.watchlist.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.demetrious.watchlist.domain.enums.WatchStatusEnum;
import ru.demetrious.watchlist.domain.model.Anime;

@Repository
public interface AnimeRepository extends JpaRepository<Anime, UUID> {
    List<Anime> deleteByIdIsIn(List<UUID> uuids);

    List<Anime> findAllByStatus(WatchStatusEnum watchStatusEnum);

    int countByStatus(WatchStatusEnum watchStatusEnum);
}
