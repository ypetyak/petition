// app.post("/pizza", (req, res) => {
//     console.log("Running POST /pizza", req.body); // once you are done with the log Delete it.
//
// function getAllPokemon() {
//     const q = `SELECT * FROM pokemon`;
//
//     return db.query(q)          /// returns promise
//         .then(results => results.rows)// returns all rows ) /// you can write one liners like this
//         .catch(err => {
//             console.log(`There was an error in getAllPokemon`, err);
//         });
// };
//
//
// function getSinglePokemon(pokeomId) {
//     const q = 'SELECT * FROM pokemon WHERE id = $1'
//     const params = [ pokemonID ]
//
//     return db.query(q)
//         .then(results => {
//             return results.rows[0] // one row, because we need only one /// results.rows[0].id - if you need only id from one row
//         })
//         .catch(err => {
//             console.log(`There was an error in getSinglePokemon`, err);
//         });
// }

///// Heroku

const express = require("express");
const app = express();

app.get("/", req, res);


git remote origin .....
