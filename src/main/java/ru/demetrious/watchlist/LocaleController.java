package ru.demetrious.watchlist;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/locale")
@Slf4j
@RequiredArgsConstructor
public class LocaleController {
    private final LocaleService localeService;

    @GetMapping("/get/{lng}/{ns}")
    public ResponseEntity<Map<String, Object>> getLocale(@PathVariable String lng, @PathVariable String ns) {
        log.info("GET: lng={}, ns={}", lng, ns);
        try {
            return ResponseEntity.ok(localeService.getLocale(lng, ns));
        } catch (IllegalKeyClassException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e));
        }
    }
}
