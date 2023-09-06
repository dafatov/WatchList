package ru.demetrious.watchlist.adapter.rest;

import java.util.Optional;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.demetrious.watchlist.adapter.rest.dto.DictionaryRsDto;
import ru.demetrious.watchlist.service.DictionaryService;

@RestController
@RequestMapping("/api/dictionaries")
@RequiredArgsConstructor
@Slf4j
public class DictionaryController {
    private final DictionaryService dictionaryService;

    @GetMapping
    public DictionaryRsDto getDictionaries(@RequestParam Optional<Set<String>> volumes) {
        DictionaryRsDto dictionaryRsDto = dictionaryService.getDictionaries(volumes);
        log.info("getDictionaries({}): {}", volumes, dictionaryRsDto);
        return dictionaryRsDto;
    }
}
