DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    first VARCHAR(200) NOT NULL,  -- NOT NULL is a constrain, if it will be empty DB should reject it
    last VARCHAR(250) NOT NULL,

)
