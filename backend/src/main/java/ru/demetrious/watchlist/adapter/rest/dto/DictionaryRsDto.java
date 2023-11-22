package ru.demetrious.watchlist.adapter.rest.dto;

import java.util.Set;
import lombok.Data;
import ru.demetrious.watchlist.domain.enums.AnimeSupplementEnum;
import ru.demetrious.watchlist.domain.enums.WatchStatusEnum;

@Data
public class DictionaryRsDto {
    private Set<WatchStatusEnum> statuses;
    private Set<AnimeSupplementEnum> supplements;
}
