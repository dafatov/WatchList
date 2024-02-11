package ru.demetrious.watchlist.adapter.rest.dto;

import java.util.List;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class FilesRsDto {
    private String commonPath;
    private List<String> files;
}
