package ru.demetrious.watchlist.locales;

import java.util.ListResourceBundle;

import static ru.demetrious.watchlist.utils.LocaleUtils.wrap;

public class Common extends ListResourceBundle {
    @Override
    protected Object[][] getContents() {
        return wrap();
    }
}
