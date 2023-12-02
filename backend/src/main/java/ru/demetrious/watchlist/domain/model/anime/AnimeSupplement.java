package ru.demetrious.watchlist.domain.model.anime;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import ru.demetrious.watchlist.annotation.UuidGenerator;
import ru.demetrious.watchlist.domain.enums.AnimeSupplementEnum;

@Entity(name = "anime_supplement")
@Getter
@Setter
@RequiredArgsConstructor
@ToString
public class AnimeSupplement {
    @Id
    @UuidGenerator
    private UUID id;
    @Enumerated(EnumType.STRING)
    private AnimeSupplementEnum name;
    @ElementCollection
    private Set<Integer> episodes = new HashSet<>();
}
