package ru.demetrious.watchlist.adapter.rest.dto;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class InfoRsDto {
    private Integer count;
    private Integer remained;
    private Integer candidates;
}
