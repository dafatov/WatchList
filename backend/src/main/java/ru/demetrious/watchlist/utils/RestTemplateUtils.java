package ru.demetrious.watchlist.utils;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.web.client.RestTemplate;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RestTemplateUtils {
    private static final RestTemplate REST_TEMPLATE = new RestTemplate();

    public static RestTemplate getRestTemplate() {
        return REST_TEMPLATE;
    }
}
