package ru.demetrious.watchlist.locales;

import java.util.ListResourceBundle;

public class Web extends ListResourceBundle {
    @Override
    protected Object[][] getContents() {
        return new Object[][]{
            {"test", new Object[][]{
                {"test", new Object[][]{
                    {"test", "Test"}
                }}
            }}
        };
    }
}
