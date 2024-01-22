package ru.demetrious.watchlist.listener;

import lombok.extern.slf4j.Slf4j;
import org.hibernate.HibernateException;
import org.hibernate.event.internal.DefaultPersistEventListener;
import org.hibernate.event.spi.PersistContext;
import org.hibernate.event.spi.PersistEvent;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class PersistEventListener extends DefaultPersistEventListener {
    @Override
    public void onPersist(PersistEvent event, PersistContext createCache) throws HibernateException {
        event.getSession().merge(event.getEntityName(), event.getObject());
    }
}
