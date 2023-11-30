package ru.demetrious.watchlist.adapter.rest;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.demetrious.watchlist.adapter.rest.dto.ShikimoriUserRsDto;
import ru.demetrious.watchlist.service.ShikimoriService;

@RestController
@RequestMapping("/api/shikimori")
@RequiredArgsConstructor
@Slf4j
public class ShikimoriController {
    private final ShikimoriService shikimoriService;

    @GetMapping("/user")
    public ResponseEntity<?> getUser(@RequestParam String nickname) {
        try {
            Optional<ShikimoriUserRsDto> userDto = shikimoriService.getUser(nickname);

            log.info("getUser: {}", userDto);
            return ResponseEntity.ok(userDto);
        } catch (Exception e) {
            log.error("Can't get user:", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
