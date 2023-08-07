package ru.demetrious.watchlist.locales;

import java.util.ListResourceBundle;

import static ru.demetrious.watchlist.utils.LocaleUtils.pair;
import static ru.demetrious.watchlist.utils.LocaleUtils.wrap;

public class Web extends ListResourceBundle {
    @Override
    protected Object[][] getContents() {
        return wrap(
            pair("test", wrap(
                pair("test", wrap(
                    pair("test", "Test")
                ))
            ))
        );
    }
}
