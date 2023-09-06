package ru.demetrious.watchlist.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.demetrious.watchlist.domain.model.Config;

@Repository
public interface ConfigRepository extends JpaRepository<Config, String> {
}
