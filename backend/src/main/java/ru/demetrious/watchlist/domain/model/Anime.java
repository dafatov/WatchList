package ru.demetrious.watchlist.domain.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import ru.demetrious.watchlist.domain.enums.WatchStatusEnum;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@ToString
public class Anime {
    @Id
    @GeneratedValue
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
    @Enumerated(EnumType.STRING)
    private WatchStatusEnum status;
    private int multipleViews;
}
