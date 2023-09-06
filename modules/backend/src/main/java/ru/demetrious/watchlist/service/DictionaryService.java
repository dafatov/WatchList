package ru.demetrious.watchlist.service;

import java.util.Arrays;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import ru.demetrious.watchlist.adapter.rest.dto.DictionaryRsDto;
import ru.demetrious.watchlist.domain.enums.AnimeSupplementEnum;
import ru.demetrious.watchlist.domain.enums.WatchStatusEnum;

@Component
@RequiredArgsConstructor
@Slf4j
public class DictionaryService {
    public DictionaryRsDto getDictionaries(Optional<Set<String>> volumesOptional) {
        DictionaryRsDto dictionaryRsDto = new DictionaryRsDto();

        volumesOptional.ifPresent(volumes -> {
            if (volumes.contains("statuses")) {
                dictionaryRsDto.setStatuses(Arrays.stream(WatchStatusEnum.values())
                    .collect(Collectors.toSet()));
            }
            if (volumes.contains("supplements")) {
                dictionaryRsDto.setSupplements(Arrays.stream(AnimeSupplementEnum.values())
                    .collect(Collectors.toSet()));
            }
        });

        return dictionaryRsDto;
    }
}
