package ru.demetrious.watchlist.feign.dto;

import jakarta.xml.bind.annotation.XmlRootElement;
import java.util.List;
import lombok.Data;

@XmlRootElement(name = "myanimelist")
@Data
public class AnimeListDto {
    private List<AnimeDto> anime;
}
