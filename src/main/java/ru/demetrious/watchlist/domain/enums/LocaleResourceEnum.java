package ru.demetrious.watchlist.domain.enums;

import java.util.Arrays;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import ru.demetrious.watchlist.locales.Web;

import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;

@RequiredArgsConstructor
@Getter
public enum LocaleResourceEnum {
    WEB("web", Web.class.getName());

    private final String ns;
    private final String className;

    public static String getClassNameByNs(String ns) {
        return Arrays.stream(LocaleResourceEnum.values())
            .filter(localeResourceEnum -> equalsIgnoreCase(localeResourceEnum.ns, ns))
            .findFirst()
            .map(LocaleResourceEnum::getClassName)
            .orElseThrow();
    }
}
