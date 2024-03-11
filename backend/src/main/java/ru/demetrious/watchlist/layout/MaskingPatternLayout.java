package ru.demetrious.watchlist.layout;

import ch.qos.logback.classic.PatternLayout;
import ch.qos.logback.classic.spi.ILoggingEvent;
import com.jayway.jsonpath.DocumentContext;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;
import org.apache.commons.lang3.StringUtils;
import ru.demetrious.watchlist.domain.model.Anime;
import ru.demetrious.watchlist.domain.model.anime.AnimeSupplement;
import ru.demetrious.watchlist.domain.model.anime.AnimeTag;
import ru.demetrious.watchlist.domain.model.anime.AnimeTagGroup;

import static com.jayway.jsonpath.Configuration.builder;
import static com.jayway.jsonpath.JsonPath.parse;
import static com.jayway.jsonpath.Option.SUPPRESS_EXCEPTIONS;
import static java.text.MessageFormat.format;
import static java.util.List.of;
import static java.util.Optional.empty;
import static java.util.Optional.ofNullable;
import static java.util.regex.Pattern.MULTILINE;
import static java.util.regex.Pattern.compile;
import static java.util.stream.Collectors.joining;
import static java.util.stream.IntStream.rangeClosed;
import static org.apache.commons.lang3.StringUtils.repeat;

public class MaskingPatternLayout extends PatternLayout {
    private static final char MASKING_CHAR = '*';
    private static final String JSON_REGEX = "((?=\\[\\{|\\{)[\\s\\S]*(?:}]|}))";
    private static final List<List<String>> REGEXES = of(
        // For Dto data format
        of(
            createDtoRegex(Anime.class, of("name", "url", "path", "pathPackage", "size", "episodes", "status", "multipleViews")),
            createDtoRegex(AnimeTag.class, of("name")),
            createDtoRegex(AnimeTagGroup.class, of("name", "iconName")),
            createDtoRegex(AnimeSupplement.class, of("name", "episodes"))
        ),
        // For xml data format
        of(
            createXmlRegex("anime", of("series_title", "series_type", "series_episodes", "my_watched_episodes", "my_times_watched",
                "my_score", "my_status", "shiki_status", "my_comments"))
        )
    );
    private static final Pattern MASKING_PATTERN = compile(Stream.concat(
        Stream.of(JSON_REGEX),
        REGEXES.stream().flatMap(Collection::stream)
    ).collect(joining("|")), MULTILINE);
    private static final List<List<String>> JSON_PATHS = of(
        of(
            "$.*.name",
            "$.*.url",
            "$.*.path",
            "$.*.pathPackage",
            "$.*.size",
            "$.*.episodes",
            "$.*.status",
            "$.*.multipleViews",
            "$.*.supplements.*.name",
            "$.*.supplements.*.episodes",
            "$.*.tags.*.name",
            "$.*.tags.*.group.name",
            "$.*.tags.*.group.iconName"
        )
    );

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

        stringBuilder.replace(start, end, findContext(substring).map(this::maskJson).orElse(maskValue(substring)));
    }

    private String maskJson(DocumentContext context) {
        JSON_PATHS.stream()
            .flatMap(Collection::stream)
            .forEach(jsonPath -> context.map(jsonPath, (object, configuration) -> maskValue(object)));

        return context.jsonString();
    }

    private String maskValue(Object object) {
        String string = String.valueOf(object);

        if (StringUtils.equals(string, "null")) {
            return string;
        }

        return repeat(MASKING_CHAR, string.length());
    }

    private Optional<DocumentContext> findContext(String string) {
        if (!string.matches(JSON_REGEX)) {
            return empty();
        }

        try {
            return ofNullable(parse(string, builder().options(SUPPRESS_EXCEPTIONS).build()));
        } catch (Exception e) {
            return empty();
        }
    }

    private static String createDtoRegex(Class<?> oClass, List<String> fieldNames) {
        return format("(?={0}\\([\\s\\S]*?{1}\\))", oClass.getSimpleName(), fieldNames.stream()
            .map(fieldName -> format("{0}=(.*?)(?=\\)|,\\s[\\S]*?=)[\\s\\S]*?", fieldName))
            .collect(joining()));
    }

    private static String createXmlRegex(String rootTag, List<String> tagNames) {
        return format("(?=<{0}>[\\s\\S]*?{1}<\\/{0}>)", rootTag, tagNames.stream()
            .map(tagName -> format("<{0}>(.*)<\\/{0}>[\\s\\S]*?", tagName))
            .collect(joining()));
    }
}
