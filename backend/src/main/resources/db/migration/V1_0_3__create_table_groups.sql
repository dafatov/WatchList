CREATE TABLE anime_tag_group
(
    id   uuid NOT NULL,
    name varchar(255),
    CONSTRAINT pk_anime_tag_group PRIMARY KEY (id)
);

ALTER TABLE anime_tag
    ADD group_id uuid;

ALTER TABLE anime_tag_group
    ADD CONSTRAINT uc_anime_tag_group_name UNIQUE (name);

ALTER TABLE anime_tag
    ADD CONSTRAINT uc_anime_tag_nagrid UNIQUE (name, group_id);

ALTER TABLE anime_tag
    ADD CONSTRAINT fk_anime_tag_on_group FOREIGN KEY (group_id) REFERENCES anime_tag_group (id);

ALTER TABLE anime_tag
    DROP CONSTRAINT IF EXISTS uk_d7sy5yjuxir577bo6mo8sm4yc;

ALTER TABLE anime_tag
    DROP CONSTRAINT IF EXISTS uk_lo3kl8sdmpy3h3fcr3r8xygts;
