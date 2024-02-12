package ru.demetrious.watchlist.adapter.rest.dto;

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
    private FilesRsDto completed;
}
