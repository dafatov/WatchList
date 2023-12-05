package ru.demetrious.watchlist.feign.dto;

import java.time.ZonedDateTime;
import java.util.List;
import lombok.Data;

@Data
public class ResourceDto {
    private String path;
    private ZonedDateTime created;
    private Embedded _embedded;

    @Data
    public static class Embedded {
        private List<ResourceDto> items;
    }
}
