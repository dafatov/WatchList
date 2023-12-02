package ru.demetrious.watchlist.generator;

import java.lang.annotation.Annotation;
import java.lang.reflect.Member;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.generator.EventType;
import org.hibernate.id.factory.spi.CustomIdGeneratorCreationContext;

import static java.util.Optional.ofNullable;
import static org.hibernate.annotations.UuidGenerator.Style;

public class UuidGenerator extends org.hibernate.id.uuid.UuidGenerator {
    public UuidGenerator(ru.demetrious.watchlist.annotation.UuidGenerator config, Member idMember, CustomIdGeneratorCreationContext creationContext) {
        super(getUuidGeneratorAnnotation(config.style()), idMember, creationContext);
    }

    @Override
    public Object generate(SharedSessionContractImplementor session, Object owner, Object currentValue, EventType eventType) {
        return ofNullable(session.getEntityPersister(null, owner))
            .map(entityPersister -> entityPersister.getIdentifier(owner, session))
            .orElse(super.generate(session, owner, currentValue, eventType));
    }

    // ===================================================================================================================
    // = Implementation
    // ===================================================================================================================

    private static org.hibernate.annotations.UuidGenerator getUuidGeneratorAnnotation(Style style) {
        return new org.hibernate.annotations.UuidGenerator() {
            @Override
            public Class<? extends Annotation> annotationType() {
                return org.hibernate.annotations.UuidGenerator.class;
            }

            @Override
            public Style style() {
                return style;
            }
        };
    }
}
