package ru.demetrious.watchlist.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Value;
import ru.demetrious.watchlist.domain.enums.WatchStatusEnum;
import ru.demetrious.watchlist.domain.model.Anime;
import ru.demetrious.watchlist.feign.dto.AnimeDto;

@Mapper
public abstract class AnimeMapper {
    @Value("${shikimori.api.url}")
    String SHIKIMORI_URL;

    @Mappings({
        @Mapping(target = "name", source = "series_title"),
        @Mapping(target = "episodes", source = "series_episodes"),
        @Mapping(target = "multipleViews", source = "my_times_watched"),
        @Mapping(target = "status", source = "my_status", qualifiedByName = "statusMapper"),
        @Mapping(target = "url", expression = "java(SHIKIMORI_URL + \"/animes/\" + animeDto.getSeries_animedb_id())"),
        @Mapping(target = "id", ignore = true),
        @Mapping(target = "path", ignore = true),
        @Mapping(target = "pathPackage", ignore = true),
        @Mapping(target = "size", ignore = true),
        @Mapping(target = "supplements", ignore = true),
        @Mapping(target = "tags", ignore = true)
    })
    public abstract Anime animeDtoToAnime(AnimeDto animeDto);

    @Named("statusMapper")
    static WatchStatusEnum mapStatus(String status) {
        return switch (status) {
            case "Completed" -> WatchStatusEnum.COMPLETED;
            case "Plan to Watch" -> WatchStatusEnum.PLANNING;
            case "Watching" -> WatchStatusEnum.WATCHING;
            default -> null;
        };
    }
}
