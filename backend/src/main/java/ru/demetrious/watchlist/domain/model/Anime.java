package ru.demetrious.watchlist.domain.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import ru.demetrious.watchlist.annotation.UuidGenerator;
import ru.demetrious.watchlist.domain.enums.WatchStatusEnum;
import ru.demetrious.watchlist.domain.model.anime.AnimeSupplement;
import ru.demetrious.watchlist.domain.model.anime.AnimeTag;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@ToString
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
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AnimeSupplement> supplements = new HashSet<>();
    @ManyToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private Set<AnimeTag> tags = new HashSet<>();
    @Enumerated(EnumType.STRING)
    private WatchStatusEnum status;
    private int multipleViews;
}
