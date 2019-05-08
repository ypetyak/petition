const spicedPg = require("spiced-pg");

// const {dbUser, dbPass} = require(./secrets)  -- connect file with login and password

const db = spicedPg("postgres:postgres:postgres@localhost:5432/cities");

// const db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/cities`); -- if you need to enter password and login

db.query("SELECT * FROM cities")
    .then(results => {
        console.log(results); // it will return an object
    })
    .catch(function(err) {
        console.log(err);
    });

/// other way to do it

db.query("SELECT city, population FROM cities")
    .then(({ rows }) => {
        console.log(rows); // it will return an object
    })
    .catch(err => {
        console.log(err);
    });

//we should not do this:

`SELECT city, population FROM ${name}`; // because users probably will make an imput and can become a vulnerability.

// what you should do:

function changeCityName(id, name) {
    db.query(`UPDATE cities SET city = $2 where id = 1$`, [id, name])
        .then(({ rows }) => {
            console.log(rows); // it will return an object
        })
        .catch(err => {
            console.log(err);
        });
}

changeCityName(1, "Phoenix");
