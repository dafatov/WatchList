package ru.demetrious.watchlist.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mappings;
import org.mapstruct.Named;
import ru.demetrious.watchlist.domain.enums.WatchStatusEnum;
import ru.demetrious.watchlist.domain.model.Anime;
import ru.demetrious.watchlist.feign.dto.AnimeDto;

@Mapper
public interface AnimeMapper {
    @Mappings({
        @org.mapstruct.Mapping(target = "name", source = "series_title"),
        @org.mapstruct.Mapping(target = "episodes", source = "series_episodes"),
        @org.mapstruct.Mapping(target = "multipleViews", source = "my_times_watched"),
        @org.mapstruct.Mapping(target = "status", source = "my_status", qualifiedByName = "statusMapper"),
        @org.mapstruct.Mapping(target = "id", ignore = true),
        @org.mapstruct.Mapping(target = "path", ignore = true),
        @org.mapstruct.Mapping(target = "pathPackage", ignore = true),
        @org.mapstruct.Mapping(target = "size", ignore = true),
        @org.mapstruct.Mapping(target = "supplements", ignore = true),
        @org.mapstruct.Mapping(target = "tags", ignore = true),
        @org.mapstruct.Mapping(target = "url", ignore = true)
    })
    Anime animeDtoToAnime(AnimeDto animeDto);

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
