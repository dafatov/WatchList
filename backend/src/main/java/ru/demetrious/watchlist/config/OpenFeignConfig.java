package ru.demetrious.watchlist.config;

import feign.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class OpenFeignConfig {
    @Bean
    @Profile("local")
    Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
}
