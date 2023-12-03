package ru.demetrious.watchlist.feign.dto;

import lombok.Data;

@Data
public class ResourceDto {
    private Embedded _embedded;

    @Data
    public static class Embedded {
        private Integer total;
    }
}
