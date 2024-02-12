package ru.demetrious.watchlist.adapter.rest.dto;

import java.util.List;
import java.util.function.Consumer;
import lombok.Data;

@Data
public class FilesGroupsDto {
    private List<String> videos;
    private List<String> voices;
    private List<String> subtitles;

    public void acceptAll(Consumer<List<String>> consumer) {
        consumer.accept(videos);
        consumer.accept(voices);
        consumer.accept(subtitles);
    }
}
