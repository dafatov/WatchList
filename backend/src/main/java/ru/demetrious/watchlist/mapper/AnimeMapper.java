package ru.demetrious.watchlist.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.Named;
import ru.demetrious.watchlist.domain.enums.WatchStatusEnum;
import ru.demetrious.watchlist.domain.model.Anime;
import ru.demetrious.watchlist.feign.dto.AnimeDto;

@Mapper
public interface AnimeMapper {
    @Mappings({
        @Mapping(target = "name", source = "series_title"),
        @Mapping(target = "episodes", source = "series_episodes"),
        @Mapping(target = "multipleViews", source = "my_times_watched"),
        @Mapping(target = "status", source = "my_status", qualifiedByName = "statusMapper"),
        @Mapping(target = "id", ignore = true),
        @Mapping(target = "path", ignore = true),
        @Mapping(target = "pathPackage", ignore = true),
        @Mapping(target = "size", ignore = true),
        @Mapping(target = "supplements", ignore = true),
        @Mapping(target = "tags", ignore = true),
        @Mapping(target = "url", ignore = true)
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
