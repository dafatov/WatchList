package ru.demetrious.watchlist.domain.model.anime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
    @Column(nullable = false)
    private String iconName;
    @OneToMany(mappedBy = "group")
    @JsonIgnore
    @ToString.Exclude
    private List<AnimeTag> tags = new ArrayList<>();
}
