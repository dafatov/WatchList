package ru.demetrious.watchlist.locales;

import java.util.ListResourceBundle;

import static ru.demetrious.watchlist.utils.LocaleUtils.pair;
import static ru.demetrious.watchlist.utils.LocaleUtils.wrap;

public class Common_ru extends ListResourceBundle {
    @Override
    protected Object[][] getContents() {
        return wrap(
            pair("navigation", wrap(
                pair("toMain", "На главную")
            )),
            pair("data", wrap(
                pair("notAvailable", "Данные недоступны")
            )),
            pair("unit", wrap(
                pair("information", "б"),
                pair("prefix", wrap(
                    pair("", ""),
                    pair("k", "Ки"),
                    pair("M", "Ми"),
                    pair("G", "Ги")
                ))
            )),
            pair("value", "{{value}} {{prefix}}{{unit}}"),
            pair("count", wrap(
                pair("all", "Все"),
                pair("nothing", "Ничего")
            )),
            pair("action", wrap(
                pair("cancel", "Отменить"),
                pair("delete", "Удалить"),
                pair("save", "Сохранить"),
                pair("edit", "Изменить")
            ))
        );
    }
}
