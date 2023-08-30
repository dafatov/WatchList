package ru.demetrious.watchlist.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.demetrious.watchlist.config.DefaultConfig;
import ru.demetrious.watchlist.domain.model.Config;
import ru.demetrious.watchlist.repository.ConfigRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConfigService {
    private final ConfigRepository configRepository;
    private final DefaultConfig defaultSetting;

    public String getData(String id) {
        return configRepository.findById(id)
            .or(() -> defaultSetting.getData(id))
            .map(Config::getData)
            .orElseThrow();
    }

    public List<Config> saveConfigs(Map<String, String> configMap) {
        return configRepository.saveAll(configMap
            .entrySet().stream()
            .map(configEntry -> new Config()
                .setId(configEntry.getKey())
                .setData(configEntry.getValue()))
            .collect(Collectors.toList()));
    }

    public Map<String, String> getConfigs() {
        return defaultSetting.getAllKeys().stream()
            .map(key -> configRepository.findById(key)
                .or(() -> defaultSetting.getData(key))
                .orElseThrow())
            .collect(Collectors.toMap(Config::getId, Config::getData));
    }
}
