package ru.demetrious.watchlist.adapter.rest;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.demetrious.watchlist.service.LocaleService;

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
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e));
        }
    }

    @PostMapping("/add/{lng}/{ns}")
    public ResponseEntity<?> addMissingLocale(
        @PathVariable String lng,
        @PathVariable String ns,
        @RequestBody Map<String, String> pairs
    ) {
        log.warn("POST: lng={}, ns={}, pairs: {}", lng, ns, pairs.keySet());
        return ResponseEntity.ok().build();
    }
}
