package ru.demetrious.watchlist;

import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static java.util.concurrent.Executors.newSingleThreadScheduledExecutor;

@RestController
@RequestMapping("/health")
@Slf4j
@Profile("!local")
public class HealthController {
    private int counter = 0;

    public HealthController() {
        newSingleThreadScheduledExecutor().scheduleWithFixedDelay(() -> {
            if (counter <= 0) {
                log.info("Exit cause didn't wait for the client");
                System.exit(14);
            }
            log.debug("counter={}", counter);
            counter = 0;
        }, 5, 1, TimeUnit.SECONDS);
    }

    @GetMapping
    public void getHealth() {
        counter++;
        log.debug("Counter was incremented");
    }
}
