package ru.demetrious.watchlist.utils;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class LocaleUtils {
    public static Object[][] wrap(Object[]... pairs) {
        return pairs;
    }

    public static Object[] pair(String key, Object value) {
        return new Object[]{key, value};
    }
}
