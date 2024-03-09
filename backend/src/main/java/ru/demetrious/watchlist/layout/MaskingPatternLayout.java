package ru.demetrious.watchlist.layout;

import ch.qos.logback.classic.PatternLayout;
import ch.qos.logback.classic.spi.ILoggingEvent;
import java.util.Collection;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Configuration;
import ru.demetrious.watchlist.domain.model.Anime;
import ru.demetrious.watchlist.domain.model.anime.AnimeSupplement;
import ru.demetrious.watchlist.domain.model.anime.AnimeTag;
import ru.demetrious.watchlist.domain.model.anime.AnimeTagGroup;

import static java.text.MessageFormat.format;
import static java.util.regex.Pattern.MULTILINE;
import static java.util.regex.Pattern.compile;
import static java.util.stream.Collectors.joining;
import static java.util.stream.IntStream.rangeClosed;
import static org.apache.commons.lang3.StringUtils.repeat;

@Configuration
public class MaskingPatternLayout extends PatternLayout {
    public static final char MASKING_CHAR = '*';
    private static final List<List<String>> REGEXES = List.of(
        List.of(
            createDtoRegex(Anime.class, List.of("name", "url", "path", "pathPackage", "size", "episodes", "status", "multipleViews")),
            createDtoRegex(AnimeTag.class, List.of("name")),
            createDtoRegex(AnimeTagGroup.class, List.of("name", "iconName")),
            createDtoRegex(AnimeSupplement.class, List.of("name"))
        )
    );
    private static final Pattern MASKING_PATTERN = compile(REGEXES.stream().flatMap(Collection::stream).collect(joining("|")), MULTILINE);

    @Override
    public String doLayout(ILoggingEvent event) {
        return maskMessage(super.doLayout(event));
    }

    // ===================================================================================================================
    // = Implementation
    // ===================================================================================================================

    private String maskMessage(String message) {
        StringBuilder stringBuilder = new StringBuilder(message);
        Matcher matcher = MASKING_PATTERN.matcher(stringBuilder);

        while (matcher.find()) {
            rangeClosed(1, matcher.groupCount())
                .filter(group -> matcher.group(group) != null)
                .forEach(group -> maskGroup(matcher.start(group), matcher.end(group), stringBuilder));
        }

        return stringBuilder.toString();
    }

    private void maskGroup(int start, int end, StringBuilder stringBuilder) {
        String substring = stringBuilder.substring(start, end);

        if (StringUtils.equals(substring, "null")) {
            return;
        }

        stringBuilder.replace(start, end, repeat(MASKING_CHAR, substring.length()));
    }

    private static String createDtoRegex(Class<?> oClass, List<String> fieldNames) {
        return format("(?={0}\\([\\s\\S]*?{1}\\))", oClass.getSimpleName(), fieldNames.stream()
            .map(fieldName -> format("{0}=(.*?)(?=\\)|,\\s[\\S]*?=)[\\s\\S]*?", fieldName))
            .collect(joining()));
    }
}
