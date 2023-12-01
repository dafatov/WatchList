package ru.demetrious.watchlist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class WatchListApplication {
    public static void main(String[] args) {
        SpringApplication.run(WatchListApplication.class, args);
    }
}
