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
                pair("information", "Б"),
                pair("prefix", wrap(
                    pair("", ""),
                    pair("Ki", "Ки"),
                    pair("Mi", "Ми"),
                    pair("Gi", "Ги"),
                    pair("Ti", "Ти")
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
                pair("edit", "Изменить"),
                pair("apply", "Применить"),
                pair("copyToClipboard", "Скопировать в буфер обмена"),
                pair("shuffle", wrap(
                    pair("on", "Начать перемешивание"),
                    pair("check", "Подтвердить кандидатов"),
                    pair("cancel", "Завершить перемешивание")
                )),
                pair("selectAll", "Выбрать всех"),
                pair("generate", "Сгенерировать"),
                pair("stop", "Остановить"),
                pair("reset", "Сбросить"),
                pair("settings", "Настройки"),
                pair("randomize", wrap(
                    pair("on", "Зарандомить смотрю")
                )),
                pair("close", "Закрыть"),
                pair("clear", "Очистить"),
                pair("open", "Открыть"),
                pair("login", "Войти"),
                pair("logout", "Выйти"),
                pair("import", "Импорт"),
                pair("export", "Экспорт"),
                pair("pickIcon", wrap(
                    pair("on", "Начать выбор иконки"),
                    pair("off", "Закончить выбор иконки")
                )),
                pair("sync", "Синхронизировать остальные поля текущим"),
                pair("showUnchanged", "Отображать неизмененное")
            )),
            pair("validation", wrap(
                pair("required", "Обязательное"),
                pair("url", "Должно быть ссылкой"),
                pair("positive", "Должно быть положительным"),
                pair("greaterZero", "Должно быть не меньше нуля"),
                pair("noEmpty", "Должен быть не пустым"),
                pair("latinWithSpaceAndHyphen", "Должен быть латинскими буквами, пробелом или дефисом в одном экземпляре внутри слова"),
                pair("userNotAvailable", "Должен быть доступным"),
                pair("sameIcon", "Должна быть одинаковая иконка"),
                pair("equalArrays", "Списки должны иметь одинаковое количество элементов")
            )),
            pair("result", wrap(
                pair("copy", "Успешно скопировано: {{name}}"),
                pair("noOptions", "Нет вариантов")
            ))
        );
    }
}
