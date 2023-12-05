CREATE TABLE anime_tag
(
    id   uuid NOT NULL
        PRIMARY KEY,
    name character varying(255)
        CONSTRAINT uk_d7sy5yjuxir577bo6mo8sm4yc
            UNIQUE
);

CREATE TABLE anime_tags
(
    animes_id uuid NOT NULL,
    tags_id   uuid NOT NULL,
    PRIMARY KEY (animes_id, tags_id),
    CONSTRAINT fke3lrv8s3cnivbs03cr6h8vxvl
        FOREIGN KEY (animes_id) REFERENCES anime,
    CONSTRAINT fkqdlto2l6ntaif5jqdqwyg101a
        FOREIGN KEY (tags_id) REFERENCES anime_tag
);
