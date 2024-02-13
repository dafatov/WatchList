package ru.demetrious.watchlist.adapter.rest.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import ru.demetrious.watchlist.domain.enums.FileManagerStatusEnum;

@Data
@Accessors(chain = true)
public class ProgressRsDto {
    private FileManagerStatusEnum status;
    private ProgressPart fullProgress;
    private ProgressPart fileProgress;
    private Long speed;
    private FilesRsDto completed;
    private String coping;

    @Data
    @Accessors(chain = true)
    public static class ProgressPart {
        private Long allSize;
        private Long currentSize;
        private Integer percent;
    }
}
