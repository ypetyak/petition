DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    -- first VARCHAR(200) NOT NULL,  -- NOT NULL is a constrain, if it will be empty DB should reject it
    -- last VARCHAR(250) NOT NULL,
    sig TEXT NOT NULL,
    user_id INTEGER NOT NULL

);

SELECT * FROM signatures;



--- 'SELECT * FROM signatures WHERE id = $1'
---  [signaturesId]

-- const q = `
-- INSERT INTO people (name)
-- VALUES 1$
-- RETURNING id
-- `
--
-- const params = {'Sean'}
--
-- db.query(q, params).then(results => {
--     resutls.rows[0].is
--
--     })
