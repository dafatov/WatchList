package ru.demetrious.watchlist.adapter.rest;

import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.demetrious.watchlist.domain.model.Config;
import ru.demetrious.watchlist.service.ConfigService;

@RestController
@RequestMapping("/api/configs")
@RequiredArgsConstructor
@Slf4j
public class ConfigController {
    private final ConfigService configService;

    @PostMapping
    public ResponseEntity<?> saveConfigs(@RequestBody Map<String, String> configList) {
        List<Config> configsSaved = configService.saveConfigs(configList);

        log.info("saveConfig: {}", configsSaved);
        return ResponseEntity.ok(configService.getConfigs());
    }

    @GetMapping
    public ResponseEntity<?> getConfigs() {
        Map<String, String> configList = configService.getConfigs();

        log.info("getConfigs: {}", configList);
        return ResponseEntity.ok(configList);
    }
}
