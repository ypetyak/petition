const express = require("express");
const app = express();
const fs = require("fs");
const bp = require("body-parser");

/// Handlebars ///

const hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

///////

app.use(express.static("./public"));

app.use(
    bp.urlencoded({
        extended: false
    })
);

/// Lets get our sign page

app.get("/petition", function(req, res) {
    res.render("signPage", {
        layout: "main"
    });
});

app.listen(8080, () => console.log("Ready to sign something."));
