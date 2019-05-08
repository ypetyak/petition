const express = require("express");
const app = express();
const bp = require("body-parser");
const cookieSession = require("cookie-session");
const hb = require("express-handlebars");

app.use(express.static("public")); // for static

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(
    bp.urlencoded({
        extended: false
    })
);

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

//// middleware

/// PURPOSE: to check if user signed Petition
// if they have, proceed with whatever they were doing
// if not, redirect them eslewhere

// First way
/// every single request will go through this

// be mindful where you put it in your code
// we can pass it any time of rout to be used ''

// app.use(function(req, res, next) {
//     if (!req.session.check) {
//         res.redirect("/");
//     } else {
//         next();
//     }
// });

//Second way

// it should run only when called, otherwise the same

function checkForSigID(req, res, next) {
    console.log("tree is a tree");
    if (!req.session.checked) {
        res.redirect("/");
    } else {
        next();
    }
}

/////

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/thanks", checkForSigID, (req, res) => {
    /// notice that we don't inovke a function here
    res.render("thanks");
});

app.post("/", (req, res) => {
    if (req.body.check) {
        req.session.checked = true;
    }
    res.redirect("/thanks");
});

app.listen(8080, () => console.log("Ready to go."));

/// WE PUT an ID in session, not that absurdly long link)
