package ru.demetrious.watchlist.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Accessors;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@ToString
@Accessors(chain = true)
public class Config {
    @Id
    private String id;
    private String data;
}
