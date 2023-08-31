package ru.demetrious.watchlist.adapter.rest.dto;

import java.util.List;
import lombok.Data;
import lombok.experimental.Accessors;
import ru.demetrious.watchlist.domain.enums.FileManagerStatusEnum;

@Data
@Accessors(chain = true)
public class FileManagerProgressRsDto {
    private FileManagerStatusEnum status;
    private Long allSize;
    private Long currentSize;
    private Long speed;
    private Integer percent;
    private List<String> completed;
    private String commonPath;
}
