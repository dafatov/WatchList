package ru.demetrious.watchlist;

import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import static java.util.Arrays.stream;
import static java.util.stream.Collectors.toMap;
import static ru.demetrious.watchlist.LocaleResourceEnum.getClassNameByNs;

@Component
@RequiredArgsConstructor
@Slf4j
public class LocaleService {
    public Map<String, Object> getLocale(String lng, String ns) throws IllegalKeyClassException {
        ResourceBundle resourceBundle = ResourceBundle.getBundle(getClassNameByNs(ns), new Locale(lng));

        return resourceBundle.keySet().stream()
            .collect(toMap(key -> key, key -> parseMapValue(key, resourceBundle.getObject(key))));
    }

    // ===================================================================================================================
    // = Implementation
    // ===================================================================================================================

    private Object parseMapValue(String key, Object value) throws IllegalKeyClassException {
        if (value instanceof String) {
            return value;
        } else if (value instanceof Object[][]) {
            return stream(((Object[][]) value))
                .collect(toMap(entry -> entry[0], entry -> {
                    Object innerKey = entry[0];

                    if (!(innerKey instanceof String)) {
                        throw new IllegalKeyClassException("Key in locale object must be type of string");
                    }

                    return parseMapValue((String) innerKey, entry[1]);
                }));
        } else {
            log.error("Unknown type of {}", value);
            return key;
        }
    }
}
