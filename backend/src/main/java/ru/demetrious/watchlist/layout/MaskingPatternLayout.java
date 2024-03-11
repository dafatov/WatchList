package ru.demetrious.watchlist.layout;

import ch.qos.logback.classic.PatternLayout;
import ch.qos.logback.classic.spi.ILoggingEvent;

import static ru.demetrious.watchlist.utils.MaskingUtils.maskMessage;

public class MaskingPatternLayout extends PatternLayout {
    @Override
    public String doLayout(ILoggingEvent event) {
        return maskMessage(super.doLayout(event));
    }
}
