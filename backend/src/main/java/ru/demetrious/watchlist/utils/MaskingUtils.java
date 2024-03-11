package ru.demetrious.watchlist.utils;

import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.DocumentContext;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import ru.demetrious.watchlist.domain.model.Anime;
import ru.demetrious.watchlist.domain.model.anime.AnimeSupplement;
import ru.demetrious.watchlist.domain.model.anime.AnimeTag;
import ru.demetrious.watchlist.domain.model.anime.AnimeTagGroup;

import static com.jayway.jsonpath.Configuration.builder;
import static com.jayway.jsonpath.JsonPath.parse;
import static com.jayway.jsonpath.Option.SUPPRESS_EXCEPTIONS;
import static java.lang.Math.ceil;
import static java.lang.Math.floorDivExact;
import static java.text.MessageFormat.format;
import static java.util.List.of;
import static java.util.Optional.empty;
import static java.util.Optional.ofNullable;
import static java.util.regex.Pattern.MULTILINE;
import static java.util.regex.Pattern.compile;
import static java.util.stream.Collectors.joining;
import static java.util.stream.IntStream.rangeClosed;
import static lombok.AccessLevel.PRIVATE;
import static org.apache.commons.lang3.StringUtils.repeat;

@NoArgsConstructor(access = PRIVATE)
public class MaskingUtils {
    private static final char MASKING_CHAR = '*';
    private static final String JSON_REGEX = "((?=\\[\\{|\\{)[\\s\\S]*(?:}]|}))";
    private static final Configuration JSON_PATH_CONFIGURATION = builder().options(SUPPRESS_EXCEPTIONS).build();
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
        // For json data format
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

    public static String maskMessage(String message) {
        StringBuilder stringBuilder = new StringBuilder(message);
        Matcher matcher = MASKING_PATTERN.matcher(stringBuilder);

        while (matcher.find()) {
            rangeClosed(1, matcher.groupCount())
                .filter(group -> matcher.group(group) != null)
                .forEach(group -> maskGroup(matcher.start(group), matcher.end(group), stringBuilder));
        }

        return stringBuilder.toString();
    }

    // ===================================================================================================================
    // = Implementation
    // ===================================================================================================================

    private static void maskGroup(int start, int end, StringBuilder stringBuilder) {
        String substring = stringBuilder.substring(start, end);

        stringBuilder.replace(start, end, findContext(substring).map(MaskingUtils::maskJson).orElse(maskValue(substring)));
    }

    private static Optional<DocumentContext> findContext(String string) {
        if (!string.matches(JSON_REGEX)) {
            return empty();
        }

        try {
            return ofNullable(parse(string, JSON_PATH_CONFIGURATION));
        } catch (Exception e) {
            return empty();
        }
    }

    private static String maskJson(DocumentContext context) {
        JSON_PATHS.stream()
            .flatMap(Collection::stream)
            .forEach(jsonPath -> context.map(jsonPath, (object, configuration) -> maskValue(object)));

        return context.jsonString();
    }

    private static String maskValue(Object object) {
        String string = String.valueOf(object);

        if (StringUtils.equals(string, "null")) {
            return string;
        }

        Pair<Integer, Integer> maskingInterval = getMaskingInterval(string);
        return string.substring(0, maskingInterval.getLeft()) + repeat(MASKING_CHAR, maskingInterval.getRight()) +
            string.substring(maskingInterval.getLeft() + maskingInterval.getRight());
    }

    private static Pair<Integer, Integer> getMaskingInterval(String string) {
        if (string.length() == 1) {
            return Pair.of(0, string.length());
        }

        if (string.length() >= 2 && string.length() <= 4) {
            return Pair.of(1, string.length() - 1);
        }

        int count = (int) ceil(0.6 * string.length());

        if (string.length() >= 5 && string.length() <= 9) {
            return Pair.of(1, count);
        }

        if (string.length() >= 10 && string.length() <= 15) {
            return Pair.of(2, count);
        }

        if (string.length() >= 16) {
            return Pair.of(floorDivExact(string.length() - count, 2), count);
        }

        return Pair.of(0, 0);
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
