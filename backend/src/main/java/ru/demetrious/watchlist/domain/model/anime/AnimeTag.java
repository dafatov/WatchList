package ru.demetrious.watchlist.domain.model.anime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.NaturalId;
import ru.demetrious.watchlist.annotation.UuidGenerator;
import ru.demetrious.watchlist.domain.model.Anime;

@Entity(name = "anime_tag")
@Getter
@Setter
@RequiredArgsConstructor
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class AnimeTag {
    @Id
    @UuidGenerator
    private UUID id;
    @NaturalId
    @EqualsAndHashCode.Include
    private String name;
    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.PERSIST, CascadeType.REFRESH, CascadeType.MERGE})
    @NaturalId(mutable = true)
    @EqualsAndHashCode.Include
    private AnimeTagGroup group;
    @ManyToMany(mappedBy = "tags")
    @JsonIgnore
    @ToString.Exclude
    private List<Anime> animes = new ArrayList<>();
}
