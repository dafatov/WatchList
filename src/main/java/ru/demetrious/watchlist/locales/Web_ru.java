package ru.demetrious.watchlist.locales;

import java.util.ListResourceBundle;
import ru.demetrious.watchlist.domain.enums.AnimeSupplementEnum;
import ru.demetrious.watchlist.domain.enums.WatchStatusEnum;

import static ru.demetrious.watchlist.utils.LocaleUtils.pair;
import static ru.demetrious.watchlist.utils.LocaleUtils.wrap;

public class Web_ru extends ListResourceBundle {
    @Override
    protected Object[][] getContents() {
        return wrap(
            pair("page", wrap(
                pair("notFound", wrap(
                    pair("title", "Ошибка 404"),
                    pair("description", "Страницы с адресом {{path}} не существует")
                )),
                pair("animes", wrap(
                    pair("table", wrap(
                        pair("name", wrap(
                            pair("title", "Наименование")
                        )),
                        pair("size", wrap(
                            pair("title", "Размер")
                        )),
                        pair("status", wrap(
                            pair("title", "Статус"),
                            pair("enum", wrap(
                                pair(WatchStatusEnum.COMPLETED.name(), "Просмотрено"),
                                pair(WatchStatusEnum.WATCHING.name(), "Смотрю"),
                                pair(WatchStatusEnum.PLANNING.name(), "Запланировано")
                            ))
                        )),
                        pair("multipleViews", wrap(
                            pair("title", "Повторных просмотров")
                        )),
                        pair("episodes", wrap(
                            pair("title", "Эпизодов")
                        )),
                        pair("supplements", wrap(
                            pair("title", "Дополнения"),
                            pair("enum", wrap(
                                pair(AnimeSupplementEnum.LAGS.name(), "Лагало"),
                                pair(AnimeSupplementEnum.NO_SUBS.name(), "Нет сабов"),
                                pair(AnimeSupplementEnum.NOT_FULL.name(), "Не полный"),
                                pair(AnimeSupplementEnum.HAS_VOICE.name(), "Есть озвучка")
                            ))
                        )),
                        pair("path", wrap(
                            pair("title", "Путь"),
                            pair("error", "Не удалось открыть папку")
                        ))
                    )),
                    pair("modal", wrap(
                        pair("confirmDeleteAnimeModal", wrap(
                            pair("title", "Вы действительно хотите удалить?"),
                            pair("text", "Данное действие удалит аниме \"{{anime.name}}\" и НЕОБРАТИМО")
                        ))
                    ))
                ))
            ))
        );
    }
}