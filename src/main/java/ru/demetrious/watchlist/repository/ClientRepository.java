package ru.demetrious.watchlist.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.demetrious.watchlist.domain.model.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {
}
