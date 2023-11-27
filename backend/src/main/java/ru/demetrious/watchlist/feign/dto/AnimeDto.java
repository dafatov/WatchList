package ru.demetrious.watchlist.feign.dto;

import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Data;

@XmlRootElement(name = "anime")
@Data
public class AnimeDto {
    private String series_title;
    private int series_episodes;
    private int my_times_watched;
    private String my_status;
    private String series_animedb_id;
}
