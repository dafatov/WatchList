package ru.demetrious.watchlist.adapter.rest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.demetrious.watchlist.adapter.rest.dto.FileManagerProgressRsDto;
import ru.demetrious.watchlist.service.FileService;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
public class FileController {
    private final FileService fileService;

    @PostMapping("/generate")
    public ResponseEntity<?> generate() {
        try {
            fileService.generate();

            log.info("generate");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Can't generate: {}", String.valueOf(e));
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/progress")
    public ResponseEntity<?> getProgress() {
        try {
            FileManagerProgressRsDto progress = fileService.getProgress();

            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            log.error("Can't get progress: {}", String.valueOf(e));
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<?> reset() {
        try {
            fileService.reset();

            log.info("reset");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Can't reset: {}", String.valueOf(e));
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/stop")
    public ResponseEntity<?> stop() {
        try {
        fileService.stop();

        log.info("stop");
        return ResponseEntity.ok().build();
    } catch (Exception e) {
        log.error("Can't stop: {}", String.valueOf(e));
        return ResponseEntity.internalServerError().body(e.getMessage());
    }
    }
}
