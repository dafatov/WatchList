package ru.demetrious.watchlist.feign.dto;

import jakarta.xml.bind.annotation.XmlRootElement;
import java.util.List;
import lombok.Data;

@XmlRootElement(name = "myanimelist")
@Data
public class AnimeListDto {
    private List<AnimeDto> anime;

    @XmlRootElement(name = "anime")
    @Data
    public static class AnimeDto {
        private String series_title;
        private int series_episodes;
        private int my_times_watched;
        private String my_status;
        private String series_animedb_id;
    }
}
