package ru.demetrious.watchlist.domain.model.anime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.UUID;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity(name = "anime_tag")
@Getter
@Setter
@RequiredArgsConstructor
@ToString
public class AnimeTag {
    @Id
    @GeneratedValue
    private UUID id;
    @Column(unique = true)
    private String name;
}
