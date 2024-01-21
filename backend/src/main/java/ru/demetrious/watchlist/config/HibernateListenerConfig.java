package ru.demetrious.watchlist.config;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.PersistenceUnit;
import lombok.RequiredArgsConstructor;
import org.hibernate.event.service.spi.EventListenerGroup;
import org.hibernate.event.service.spi.EventListenerRegistry;
import org.hibernate.event.spi.EventType;
import org.hibernate.internal.SessionFactoryImpl;
import org.springframework.context.annotation.Configuration;
import ru.demetrious.watchlist.listener.MergeEventListener;

@Configuration
@RequiredArgsConstructor
public class HibernateListenerConfig {
    private final MergeEventListener mergeEventListener;
    @PersistenceUnit
    private EntityManagerFactory entityManagerFactory;

    @PostConstruct
    protected void init() {
        SessionFactoryImpl sessionFactory = entityManagerFactory.unwrap(SessionFactoryImpl.class);
        EventListenerRegistry eventListenerRegistry = sessionFactory.getServiceRegistry().getService(EventListenerRegistry.class);
        EventListenerGroup<org.hibernate.event.spi.MergeEventListener> mergeEventListenerGroup = eventListenerRegistry.getEventListenerGroup(EventType.MERGE);

        mergeEventListenerGroup.clearListeners();
        mergeEventListenerGroup.appendListener(mergeEventListener);
    }
}
