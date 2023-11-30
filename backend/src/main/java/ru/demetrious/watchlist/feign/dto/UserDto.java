package ru.demetrious.watchlist.feign.dto;

import java.util.List;
import lombok.Data;

@Data
public class UserDto {
    private ImageDto image;
    private String nickname;
    private List<String> common_info;

    @Data
    public static class ImageDto {
        private String x32;
    }
}
