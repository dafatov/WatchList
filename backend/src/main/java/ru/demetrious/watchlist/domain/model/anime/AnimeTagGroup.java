package ru.demetrious.watchlist.domain.model.anime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.NaturalId;
import ru.demetrious.watchlist.annotation.UuidGenerator;

@Entity(name = "anime_tag_group")
@Getter
@Setter
@RequiredArgsConstructor
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class AnimeTagGroup {
    @Id
    @UuidGenerator
    private UUID id;
    @NaturalId
    @EqualsAndHashCode.Include
    private String name;
    private String iconName;
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    private Set<AnimeTag> groups = new HashSet<>();
}
