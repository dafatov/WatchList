package ru.demetrious.watchlist.utils;

import java.net.URI;
import java.nio.file.Path;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import ru.demetrious.watchlist.domain.enums.WatchStatusEnum;
import ru.demetrious.watchlist.domain.model.Anime;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AnimeUtils {
    public static Path getPath(Anime anime) {
        return Path.of(anime.getPath());
    }

    public static URI getURI(Anime anime) {
        return URI.create(anime.getUrl());
    }

    public static Boolean isWatching(Anime anime) {
        return WatchStatusEnum.WATCHING.equals(anime.getStatus());
    }
}
