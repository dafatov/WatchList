package ru.demetrious.watchlist.adapter.rest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.demetrious.watchlist.service.ShikimoriService;

@RestController
@RequestMapping("/api/shikimori")
@RequiredArgsConstructor
@Slf4j
public class ShikimoriController {
    private final ShikimoriService shikimoriService;

    @GetMapping("/user/exist")
    public ResponseEntity<?> isUserExist(@RequestParam String nickname) {
        try {
            Boolean isUserExist = shikimoriService.isUserExist(nickname);

            log.info("isUserExist: {}={}", nickname, isUserExist);
            return ResponseEntity.ok(isUserExist);
        } catch (Exception e) {
            log.error("Can't check existence of user:", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
