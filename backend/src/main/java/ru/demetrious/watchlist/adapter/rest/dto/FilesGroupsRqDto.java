package ru.demetrious.watchlist.adapter.rest.dto;

import java.util.List;
import java.util.function.Consumer;
import lombok.Data;

@Data
public class FilesGroupsRqDto {
    private List<String> postfixes;
    private FilesRqDto files;

    @Data
    public static class FilesRqDto {
        private List<String> videos;
        private List<String> voices;
        private List<String> subtitles;

        public void acceptAll(Consumer<List<String>> consumer) {
            consumer.accept(getVideos());
            consumer.accept(getVoices());
            consumer.accept(getSubtitles());
        }
    }
}
