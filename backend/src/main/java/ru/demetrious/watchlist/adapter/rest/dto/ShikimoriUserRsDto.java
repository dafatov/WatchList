package ru.demetrious.watchlist.adapter.rest.dto;

import lombok.Data;

@Data
public class ShikimoriUserRsDto {
    private String nickname;
    private String avatar;
    private Boolean isPublic;
}
