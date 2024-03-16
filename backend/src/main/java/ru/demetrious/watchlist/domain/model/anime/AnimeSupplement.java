package ru.demetrious.watchlist.domain.model.anime;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Accessors;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.NaturalId;
import ru.demetrious.watchlist.annotation.UuidGenerator;
import ru.demetrious.watchlist.domain.enums.AnimeSupplementEnum;

import static jakarta.persistence.EnumType.STRING;
import static org.hibernate.type.SqlTypes.JSON;

@Entity(name = "anime_supplement")
@Getter
@Setter
@RequiredArgsConstructor
@ToString
@Accessors(chain = true)
public class AnimeSupplement {
    @Id
    @UuidGenerator
    private UUID id;
    @Enumerated(STRING)
    @NaturalId
    private AnimeSupplementEnum name;

    @JdbcTypeCode(JSON)
    private List<Integer> episodes = new ArrayList<>();

    public void sorted() {
        episodes.sort(Integer::compareTo);
    }
}
