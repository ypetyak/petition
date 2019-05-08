var bcrypt = require("bcryptjs");

const { promisify } = require("util");

const genSalt = promisify(bcrypt.genSalt);
const hash = promisify(bcrypt.hash);
const compare = promisify(bcrypt.compare);

exports.hashPass = pass => {
    return genSalt().then(salt => {
        console.log(salt);
        return hash(pass, salt);
    });
};

exports.checkPass = (pass, hash) => {
    compare(pass, hash);
};

exports
    .hashPass("monkey")
    .then(hash => {
        console.log(hash);
        return exports.checkPass("monkey", hash);
    })
    .then(doesMatch => console.log(doesMatch));

// genSalt()
//     .then(salt => {
//         console.log(salt);
//         return hash("monkey", salt);
//     })
//     .then(hash => {
//         console.log(hash);
//         return compare("monkey", hash);
//     })
//     .then(doesMatch => {
//         console.log(doesMatch);
//     });













/////////










CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(200) NOT NULL,
    last VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL

)


CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    first VARCHAR(200) NOT NULL,  -- NOT NULL is a constrain, if it will be empty DB should reject it
    last VARCHAR(250) NOT NULL,
    sig TEXT NOT NULL,
    user_id INTEGER NOT NULL        /// also knows as a foreign key
    // user_id INTEGER REFERENCES users(id) NOT NULL        /// proper way to reference it

);

///create a middleware function to redirect people without registration to the registration page.

///redirect them to signature page when they have registered

/// to login

// pass function to get info from the user databse and redirect to petition, if they have signed - redirect to the thank you page

we need to get signature is with their user id 
