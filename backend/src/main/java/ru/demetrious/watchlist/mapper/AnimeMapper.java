package ru.demetrious.watchlist.mapper;

import java.util.ArrayList;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Value;
import ru.demetrious.watchlist.domain.enums.AnimeSupplementEnum;
import ru.demetrious.watchlist.domain.enums.WatchStatusEnum;
import ru.demetrious.watchlist.domain.model.Anime;
import ru.demetrious.watchlist.domain.model.anime.AnimeSupplement;
import ru.demetrious.watchlist.feign.dto.AnimeListDto.AnimeDto;

import static java.util.stream.Collectors.toList;
import static java.util.stream.IntStream.range;

@Mapper
public abstract class AnimeMapper {
    @Value("${shikimori.api.url}")
    String SHIKIMORI_URL;

    @Named("mapStatus")
    static WatchStatusEnum mapStatus(String status) {
        return switch (status) {
            case "Completed" -> WatchStatusEnum.COMPLETED;
            case "Plan to Watch" -> WatchStatusEnum.PLANNING;
            case "Watching" -> WatchStatusEnum.WATCHING;
            default -> null;
        };
    }

    @Named("mapSupplements")
    static List<AnimeSupplement> mapSupplements(int watchedEpisodes) {
        List<AnimeSupplement> supplements = new ArrayList<>();

        if (watchedEpisodes > 0) {
            AnimeSupplement completed = new AnimeSupplement();

            completed.setName(AnimeSupplementEnum.COMPLETED);
            completed.setEpisodes(range(1, watchedEpisodes + 1).boxed().collect(toList()));
            supplements.add(completed);
        }

        return supplements;
    }

    @Mappings({
        @Mapping(target = "name", source = "series_title"),
        @Mapping(target = "episodes", source = "series_episodes"),
        @Mapping(target = "multipleViews", source = "my_times_watched"),
        @Mapping(target = "status", source = "my_status", qualifiedByName = "mapStatus"),
        @Mapping(target = "url", expression = "java(SHIKIMORI_URL + \"/animes/\" + animeDto.getSeries_animedb_id())"),
        @Mapping(target = "supplements", source = "my_watched_episodes", qualifiedByName = "mapSupplements"),
        @Mapping(target = "id", ignore = true),
        @Mapping(target = "path", ignore = true),
        @Mapping(target = "pathPackage", ignore = true),
        @Mapping(target = "size", ignore = true),
        @Mapping(target = "tags", ignore = true)
    })
    public abstract Anime animeDtoToAnime(AnimeDto animeDto);
}
