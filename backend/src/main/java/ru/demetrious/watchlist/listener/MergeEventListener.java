package ru.demetrious.watchlist.listener;

import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.event.internal.DefaultMergeEventListener;
import org.hibernate.event.spi.EventSource;
import org.hibernate.event.spi.MergeContext;
import org.hibernate.event.spi.MergeEvent;
import org.hibernate.metamodel.mapping.internal.SimpleNaturalIdMapping;
import org.hibernate.persister.entity.EntityPersister;
import org.springframework.stereotype.Component;

import static java.util.Arrays.stream;
import static java.util.Optional.ofNullable;

@Slf4j
@Component
public class MergeEventListener extends DefaultMergeEventListener {
    @Override
    public void onMerge(MergeEvent event, MergeContext copiedAlready) throws HibernateException {
        EventSource session = event.getSession();
        Object original = event.getOriginal();
        EntityPersister entityPersister = session.getEntityPersister(event.getEntityName(), original);

        findIdentifierByNaturalId(session, original, entityPersister)
            .map(identifierByNaturalId -> entityPersister.getIdentifierType().deepCopy(identifierByNaturalId, session.getFactory()))
            .ifPresent(identifierByNaturalId -> {
                entityPersister.setIdentifier(original, identifierByNaturalId, session);
                log.debug("For entity {} set id ({})", original, identifierByNaturalId);
            });

        super.onMerge(event, copiedAlready);
    }

    // ===================================================================================================================
    // = Implementation
    // ===================================================================================================================

    private Optional<Object> findIdentifierByNaturalId(SharedSessionContractImplementor session, Object owner, EntityPersister entityPersister) {
        return ofNullable(entityPersister.getNaturalIdentifierProperties())
            .filter(naturalIdPositions -> naturalIdPositions.length > 0)
            .map(naturalIdPositions -> stream(naturalIdPositions)
                .mapToObj(entityPersister::getAttributeMapping)
                .map(naturalAttribute -> naturalAttribute.getValue(owner))
                .toArray())
            .map(naturalIds -> entityPersister.getEntityMappingType().getNaturalIdMapping() instanceof SimpleNaturalIdMapping
                ? naturalIds[0]
                : naturalIds)
            .map(naturalId -> session.getPersistenceContext().getNaturalIdResolutions()
                .findCachedIdByNaturalId(naturalId, entityPersister.getEntityMappingType()));
    }
}
