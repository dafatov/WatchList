CREATE TABLE anime
(
    id             uuid    NOT NULL
        PRIMARY KEY,
    episodes       integer,
    multiple_views integer NOT NULL,
    name           character varying(255),
    path           character varying(255),
    size           bigint,
    status         character varying(255),
    url            character varying(255),
    CHECK ("STATUS" IN ('WATCHING', 'COMPLETED', 'PLANNING', 'CANDIDATE'))
);

CREATE TABLE anime_supplement
(
    id   uuid NOT NULL
        PRIMARY KEY,
    name character varying(255),
    CHECK ("NAME" IN ('NOT_FULL', 'NO_SUBS', 'LAGS', 'HAS_VOICE', 'COMPLETED'))
);

CREATE TABLE anime_supplements
(
    anime_id       uuid NOT NULL,
    supplements_id uuid NOT NULL
        CONSTRAINT uk_bd6asvpel1nkhxspp2w40a487
            UNIQUE,
    PRIMARY KEY (anime_id, supplements_id),
    CONSTRAINT fk6e43uckke6xm06qqngon4mkxn
        FOREIGN KEY (anime_id) REFERENCES anime,
    CONSTRAINT fkgnx24xelmd1cup9hexkgapiv2
        FOREIGN KEY (supplements_id) REFERENCES anime_supplement
);

CREATE TABLE anime_supplement_episodes
(
    anime_supplement_id uuid NOT NULL,
    episodes            integer,
    CONSTRAINT fkqixf0m9rrogby8ddpabe3iyvl
        FOREIGN KEY (anime_supplement_id) REFERENCES anime_supplement
);

CREATE TABLE config
(
    id   character varying(255) NOT NULL
        PRIMARY KEY,
    data character varying(255)
);
