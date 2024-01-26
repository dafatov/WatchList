ALTER TABLE anime_tag
    ADD group_id uuid;

ALTER TABLE anime_tag
    DROP CONSTRAINT IF EXISTS uk_d7sy5yjuxir577bo6mo8sm4yc;

ALTER TABLE anime_tag
    DROP CONSTRAINT IF EXISTS uk_lo3kl8sdmpy3h3fcr3r8xygts;

ALTER TABLE anime_tag
    ADD CONSTRAINT uk_lo3kl8sdmpy3h3fcr3r8xygts
        UNIQUE (group_id, name);

CREATE TABLE anime_tag_group
(
    id        uuid                   NOT NULL
        PRIMARY KEY,
    icon_name character varying(255) NOT NULL,
    name      character varying(255)
        CONSTRAINT uk_a6f2h1x3yu3apsedi9p30wmi8
            UNIQUE
);

ALTER TABLE anime_tag
    ADD CONSTRAINT fk3ihr2i2rlcdddm3bpmx8vwj99
        FOREIGN KEY (group_id) REFERENCES anime_tag_group;
