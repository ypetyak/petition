DROP TABLE IF EXISTS user_profiles;

CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE, -- REFERENCES users(id)
    age VARCHAR(200),
    city VARCHAR(200),
    url VARCHAR(250)
);


-- The order you drop tables is important. You need to drop tables first which have dependencies
