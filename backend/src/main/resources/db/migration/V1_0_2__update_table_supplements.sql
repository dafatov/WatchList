ALTER TABLE anime_supplement
    ADD episodes json;

UPDATE anime_supplement
SET episodes = (SELECT convert(array_agg(episodes ORDER BY episodes ASC), json) AS episodes
                    FROM anime_supplement_episodes
                    WHERE anime_supplement_id = anime_supplement.id);

DROP TABLE anime_supplement_episodes;
