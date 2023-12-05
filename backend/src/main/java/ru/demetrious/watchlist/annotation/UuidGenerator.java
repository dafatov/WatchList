package ru.demetrious.watchlist.annotation;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import org.hibernate.annotations.IdGeneratorType;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;
import static org.hibernate.annotations.UuidGenerator.Style;

@IdGeneratorType(ru.demetrious.watchlist.generator.UuidGenerator.class)
@Retention(RUNTIME)
@Target({FIELD, METHOD})
public @interface UuidGenerator {
    Style style() default Style.AUTO;
}
