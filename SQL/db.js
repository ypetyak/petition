const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/petition"
);

// let dbUrl;
//
// if (process.env.DATABASE_URL) {
//     dbUrl = process.env.DATABASE_URL;
// } else {
//     const secrets = require("./secrets.json");
//     dbUrl = secrets.dbUrl;
// }

exports.saveSignature = (sig, user_id) => {
    const q =
        "INSERT INTO signatures (sig, user_id) VALUES ($1, $2) RETURNING id, user_id";
    return db.query(q, [sig || null, user_id]);
};

exports.returnSignature = user_id => {
    const q = "SELECT sig FROM signatures WHERE user_id = ($1)";
    return db.query(q, [user_id]);
};

////

exports.deleteSignature = user_id => {
    const q = `
    DELETE FROM signatures
    WHERE user_id = ($1)
    `;
    return db.query(q, [user_id]);
};

////

exports.lookForNames = () => {
    return db.query(`
        SELECT users.first, users.last, user_profiles.age, user_profiles.city, user_profiles.url, signatures.user_id
        FROM users
        JOIN user_profiles
        ON users.id = user_profiles.user_id
        JOIN signatures
        ON users.id = signatures.user_id
        `);
};

exports.lookForCity = city => {
    const q = `
        SELECT users.first, users.last, user_profiles.age, user_profiles.city, user_profiles.url
        FROM users
        JOIN user_profiles
        ON users.id = user_profiles.user_id
        JOIN signatures
        ON users.id = signatures.user_id
        WHERE city = ($1);
        `;
    return db.query(q, [city]);
};

exports.registration = (first, last, email, password) => {
    const q =
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING first, last, id";
    return db.query(q, [
        first || null,
        last || null,
        email || null,
        password || null
    ]);
};

exports.returnPassword = email => {
    const q = "SELECT password, first, last, id FROM users WHERE email = ($1)";
    return db.query(q, [email]);
};

exports.saveProfile = (user_id, age, city, url) => {
    const q =
        "INSERT INTO user_profiles (user_id, age, city, url) VALUES ($1, $2, $3, $4)";
    return db.query(q, [user_id, age, city, url]);
};

//////////

exports.extractProfileInfo = user_id => {
    const q = `
SELECT users.first, users.last, users.email, users.password, user_profiles.age, user_profiles.city, user_profiles.url, user_profiles.user_id
FROM users
JOIN user_profiles
ON users.id = user_profiles.user_id
WHERE user_id = ($1)
`;
    return db.query(q, [user_id]);
};

//// Now we create a function to update profile information

exports.updateUserTableWithoutPassword = (user_id, first, last, email) => {
    const q = `

    UPDATE users
    SET first = $2, last = $3, email = $4
    WHERE id = $1
    `;
    return db.query(q, [user_id, first, last, email]);
};

exports.updateUserTable = (user_id, first, last, email, password) => {
    const q = `
    INSERT INTO users (id, first, last, email, password)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (id)
    DO UPDATE SET first = ($2), last = ($3), email = ($4), password = ($5)
    `;
    return db.query(q, [user_id, first, last, email, password]);
};

exports.updateProfileTable = (age, city, url, user_id) => {
    const q = `
    INSERT INTO user_profiles (age, city, url, user_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET age = $1, city = $2, url = $3
    `;
    return db.query(q, [age, city, url, user_id]);
};
