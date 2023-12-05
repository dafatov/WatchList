package ru.demetrious.watchlist.utils;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RestTemplateUtils {
    private static final RestTemplate REST_TEMPLATE = new RestTemplate();

    public static RestTemplate getRestTemplate() {
        return REST_TEMPLATE;
    }

    public static <T> HttpEntity<MultiValueMap<String, T>> createHttpEntity(T object) {
        HttpHeaders headers = new HttpHeaders();
        MultiValueMap<String, T> body = new LinkedMultiValueMap<>();

        headers.setContentType(MULTIPART_FORM_DATA);
        body.add("file", object);

        return new HttpEntity<>(body, headers);
    }
}
