package ru.demetrious.watchlist.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Accessors;
import ru.demetrious.watchlist.annotation.UuidGenerator;
import ru.demetrious.watchlist.domain.enums.WatchStatusEnum;
import ru.demetrious.watchlist.domain.model.anime.AnimeSupplement;
import ru.demetrious.watchlist.domain.model.anime.AnimeTag;

import static jakarta.persistence.CascadeType.ALL;
import static jakarta.persistence.CascadeType.DETACH;
import static jakarta.persistence.CascadeType.MERGE;
import static jakarta.persistence.CascadeType.PERSIST;
import static jakarta.persistence.CascadeType.REFRESH;
import static java.util.Comparator.comparing;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@ToString
@Accessors(chain = true)
public class Anime {
    @Id
    @UuidGenerator
    private UUID id;
    private String name;
    private String url;
    private String path;
    @Transient
    private String pathPackage;
    private Long size;
    private Integer episodes;
    @OneToMany(cascade = ALL, orphanRemoval = true)
    private List<AnimeSupplement> supplements = new ArrayList<>();
    @ManyToMany(cascade = {DETACH, MERGE, PERSIST, REFRESH})
    private List<AnimeTag> tags = new ArrayList<>();
    @Enumerated(EnumType.STRING)
    private WatchStatusEnum status;
    private int multipleViews;

    public Anime sorted() {
        supplements.forEach(AnimeSupplement::sorted);
        supplements.sort(comparing(AnimeSupplement::getName));
        tags.sort(comparing(AnimeTag::getName));

        return this;
    }
}
