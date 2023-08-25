package ru.demetrious.watchlist.config;

import com.manoelcampos.randomorg.RandomOrgClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RandomOrgConfig {
    @Value("${random-org.api.key}")
    private String API_KEY;

    @Bean
    public RandomOrgClient randomOrgClient() {
        return new RandomOrgClient(API_KEY);
    }
}
