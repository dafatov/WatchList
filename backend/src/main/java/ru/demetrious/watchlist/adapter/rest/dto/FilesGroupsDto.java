package ru.demetrious.watchlist.adapter.rest.dto;

import java.util.List;
import lombok.Data;

@Data
public class FilesGroupsDto {
    private List<String> videos;
    private List<String> voices;
    private List<String> subtitles;
}
