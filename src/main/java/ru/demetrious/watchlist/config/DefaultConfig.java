package ru.demetrious.watchlist.config;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Properties;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.AbstractEnvironment;
import org.springframework.core.env.Environment;
import ru.demetrious.watchlist.domain.model.Config;

@Configuration
@RequiredArgsConstructor
@PropertySource("classpath:default.properties")
public class DefaultConfig {
    private final Environment environment;

    public Optional<Config> getData(String key) {
        return Optional.ofNullable(environment.getProperty(key))
            .map(value -> new Config()
                .setId(key)
                .setData(value));
    }

    public List<String> getAllKeys() {
        return ((Properties) Objects.requireNonNull(((AbstractEnvironment) environment).getPropertySources()
                .get("class path resource [default.properties]"))
            .getSource())
            .keySet().stream()
            .map(Object::toString)
            .collect(Collectors.toList());
    }
}
