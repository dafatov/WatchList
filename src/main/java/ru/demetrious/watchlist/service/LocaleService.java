package ru.demetrious.watchlist.service;

import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import static java.util.Arrays.stream;
import static java.util.stream.Collectors.toMap;
import static ru.demetrious.watchlist.domain.enums.LocaleResourceEnum.getClassNameByNs;

@Component
@RequiredArgsConstructor
@Slf4j
public class LocaleService {
    public Map<String, Object> getLocale(String lng, String ns) {
        ResourceBundle resourceBundle = ResourceBundle.getBundle(getClassNameByNs(ns), new Locale(lng));

        return resourceBundle.keySet().stream()
            .collect(toMap(key -> key, key -> parseMapValue(key, resourceBundle.getObject(key))));
    }

    // ===================================================================================================================
    // = Implementation
    // ===================================================================================================================

    private Object parseMapValue(String key, Object value) {
        if (value instanceof String) {
            return value;
        } else if (value instanceof Object[][]) {
            return stream(((Object[][]) value))
                .collect(toMap(entry -> entry[0], entry -> parseMapValue((String) entry[0], entry[1])));
        } else {
            log.error("Forbidden type of \"{}\": {}", value, value.getClass().getName());
            return key;
        }
    }
}
