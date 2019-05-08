const express = require("express");
const app = express();
const bp = require("body-parser");

const fs = require("fs");
const db = require("./SQL/db.js");


const cache = require("./cache");

const cookieSession = require("cookie-session");

/// protection

const csurf = require("csurf");

///
const { hashPass, checkPass } = require("./public/hashing");

////

app.use(express.static("./public"));

/// Handlebars ///

const hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

//////

app.use(
    bp.urlencoded({
        extended: false
    })
);

///

app.use(
    cookieSession({
        secret: `Sign petition.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(csurf()); /// have to be after cookie session

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); // locals is an empty object
    next();
});



app.get("/", function(req, res) {
    res.render("welcome", {
        layout: "main"
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This function will check weather the user is logged in. Also we will insert this
// function to other get requests to check if its true or not.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkIfLogged(req, res, next) {
    if (!req.session.user) {
        res.redirect("/");
    } else {
        next();
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Here we have a /petition GET and POST requests. In GET we check for signID to see if we have already signed the petition.
/// In POST we will access save signature to the Table and Return id to assign to the sigID (we will need it to check if we have signed the petiton)
///
/// Remember that we have a canvas.js file where we tranfrom signature into a data string, and then insert it into the input filed, which then get transfered /// to the table.
///////////////////////////////////////////////////////////////////////////////////

app.get("/petition", checkIfLogged, function(req, res) {
    if (req.session.user.signID) {
        res.redirect("/thankYou");
    } else {
        res.render("signPage", {
            layout: "main",
            name: req.session.user.firstName + " " + req.session.user.lastName
        });
    }
});

app.post("/petition", (req, res) => {
    db.saveSignature(req.body.sig, req.session.user.userId)
        .then(results => {
            req.session.user.signID = results.rows[0].user_id;
            res.redirect("/thankYou");
        })
        .catch(err => {
            console.log("Save Signature Error:", err);
            res.render("signPage", {
                layout: "main",
                error: true
            });
        });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Here we have a /thankYou GET and POST requests. In GET we request signature from our Table in order to instert it as an image at
/// the Thank You page. We request it by using signID (which is same as userId). Then we insert it into the handlebars.
/// Notice that what we recieve from the Table is an object with an array in it, where we access signature.
///
/// In POST we delete our signature from table. In fact we delete all row where it is located. Thats also why we use userId,
/// which we made sort of a uniqe identifier across our website.
///////////////////////////////////////////////////////////////////////////////////

app.get("/thankYou", checkIfLogged, function(req, res) {
    cache.del("list");
    if (!req.session.user.signID) {
        res.redirect("/petition");
    } else {
        db.returnSignature(req.session.user.signID)
            .then(results => {
                res.render("thanksPage", {
                    layout: "main",
                    signature: results.rows[0].sig,
                    name:
                        req.session.user.firstName +
                        " " +
                        req.session.user.lastName
                });
            })
            .catch(err => {
                console.log("Error in returnSignature:", err);
                res.render("signPage", {
                    layout: "main",
                    error: true
                });
            });
    }
});

app.post("/thankYou", function(req, res) {
    db.deleteSignature(req.session.user.userId)
        .then(results => {
            delete req.session.user.signID;
            res.redirect("/petition");
        })
        .catch(err => {
            console.log("Error is in deleteSignature", err);
            res.render("thanksPage", {
                layout: "main",
                error: true
            });
        });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Here we have a GET request for a /listOfPeople as well as GET for /signers/:city. In listOfPeople we extract all people from the Table,
/// also combining data from two tables. In handlebars we have {{each}} which will make it work sort of like a loop and go through all elements
/// we have in inserted array. Notice that we don't have to use "names.row[0].age".
///
/// In /signers/:city we do almost the same, but also make request to our Table with a WHERE condition, whrere we get city what we want. To get a city name we /// simply use req.params.city, which will extract it from the url. Also link with the city, comes from handlebars, you can see it there.
///////////////////////////////////////////////////////////////////////////////////

app.get("/listOfPeople", checkIfLogged, (req, res) => {

    db.lookForNames()
        .then(names => {
            res.render("list", {
                layout: "main",
                signers: names.rows,
                count: names.rowCount,
                age: names.age,
                city: names.city,
                url: names.url,
                name:
                    req.session.user.firstName + " " + req.session.user.lastName
            });
        })
        .catch(err => {
            console.log("Look For Names Error: ", err);
            res.render("register", {
                layout: "main",
                error: true
            });
        });
});

app.get("/signers/:city", (req, res) => {
    var nameOftheCity = req.params.city;
    db.lookForCity(nameOftheCity)
        .then(names => {
            res.render("list", {
                layout: "main",
                signers: names.rows,
                count: names.rowCount,
                age: names.age,
                city: names.city,
                url: names.url,
                name:
                    req.session.user.firstName + " " + req.session.user.lastName
            });
        })
        .catch(err => {
            console.log("Look For Names With Cities Error: ", err);
            res.render("register", {
                layout: "main",
                error: true
            });
        });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// When we go for /logout, which we access with our button, it will set out session to be null, so when we check if we are logged in,
/// it will fail and redirect us to the registration page.
///////////////////////////////////////////////////////////////////////////////////

app.get("/logout", function(req, res) {
    req.session = null;
    // req.session.destroy;
    res.redirect("/");
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Now we will perform registration. In short - we have forms where we insert information and then we send them to the
/// table. And then we RETURN them from the table, so we can add them to our session. We use session to store data of the user,
/// to see if this is the same person or if we need to use it later. Also we hash our password here.
///
/// We have hashing.js file with the security elements where we hash password and compare it with the inserted password.
///////////////////////////////////////////////////////////////////////////////////

app.get("/register", function(req, res) {
    res.render("register", {
        layout: "main"
    });
});

app.post("/register", function(req, res) {
    cache.del("list");
    hashPass(req.body.password)
        .then(hashed => {
            db.registration(
                req.body.first,
                req.body.last,
                req.body.email,
                hashed
            ).then(results => {
                req.session = {
                    user: {
                        userId: results.rows[0].id,
                        firstName: results.rows[0].first,
                        lastName: results.rows[0].last
                    }
                };
                res.redirect("/profile");
            });
        })
        .catch(err => {
            console.log("Registration Error: ", err);
            res.render("register", {
                layout: "main",
                error: true
            });
        });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// In profile part we need to insert data to the Table similar to the register page but with much less constrains.
///////////////////////////////////////////////////////////////////////////////////

app.get("/profile", checkIfLogged, function(req, res) {
    res.render("profile", {
        layout: "main"
    });
});

app.post("/profile", (req, res) => {
    cache.del("list");
    db.saveProfile(
        req.session.user.userId,
        req.body.age,
        req.body.city,
        req.body.homepage
    )
        .then(results => {
            res.redirect("/petition");
        })
        .catch(err => {
            console.log("Error in saveProfile:", err);
            res.render("signPage", {
                layout: "main",
                error: true
            });
        });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// In login Part our goal is to compare the inserted information with the one we have and allow (or not) user to procced within our website.
/// We use email inserted by user to exract password from the table. Then we compare new password with stored one, by using checkPass function
/// and if it is the same, we proceed further and creat new session object.
///
/// Notice how we create it only after we checked if the password is true or not.
///////////////////////////////////////////////////////////////////////////////////

app.get("/login", function(req, res) {
    res.render("login", {
        layout: "main"
    });
});

app.post("/login", function(req, res) {
    db.returnPassword(req.body.email)
        .then(result => {
            var sessionObject = result;

            var savedPas = result.rows[0].password;

            checkPass(req.body.password, savedPas).then(result => {
                if (result) {
                    req.session = {
                        user: {
                            userId: sessionObject.rows[0].id,
                            firstName: sessionObject.rows[0].first,
                            lastName: sessionObject.rows[0].last,
                            signID: sessionObject.rows[0].id
                        }
                    };

                    res.redirect("/petition");
                } else {
                    throw "error in login";
                }
            });
        })
        .catch(err => {
            console.log("Error in Login: ", err);
            res.render("login", {
                layout: "main",
                error: true
            });
        });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// In GET part of profile edit we need to fill our forms with the information from the Tables, so we use cool query, which allows
/// us to combine two or more tables. And to display information we created new handlebars where we inser information.
/// In our html we simply insert this value to the "value" property and thats how it will be visible on page load.
///
/// In post request we need to update two tables. Contrary to how we have extracted information from tables, we will need to create two separate
/// quries for two tables. And even one more for the tbale with the password and we will have to check if user also changed the password.
///////////////////////////////////////////////////////////////////////////////////

app.get("/profile/edit", checkIfLogged, (req, res) => {
    var userId = req.session.user.userId;
    // console.log(" user ID  ", userId);
    db.extractProfileInfo(userId)
        .then(result => {
            console.log("This is my results:", result);
            res.render("profileEdit", {
                layout: "main",
                firstName: result.rows[0].first,
                lastName: result.rows[0].last,
                email: result.rows[0].email,
                // password: result.rows[0].password,
                age: result.rows[0].age,
                city: result.rows[0].city,
                url: result.rows[0].url,
                name:
                    req.session.user.firstName + " " + req.session.user.lastName
            });
        })
        .catch(err => {
            console.log("Error in extractProfileInfo:", err);
            res.render("profileEdit", {
                layout: "main",
                error: true
            });
        });
});

//// Now we will update profile info:

app.post("/profile/edit", (req, res) => {
    cache.del("list");
    if (req.body.password != "") {
        hashPass(req.body.password).then(hashed => {
            db.updateUserTable(
                req.session.user.userId,
                req.body.first,
                req.body.last,
                req.body.email,
                hashed
            ).catch(err => {
                console.log("Error in updateUserTable:", err);
                res.render("profileEdit", {
                    layout: "main",
                    error: true
                });
            });
        });
    } else {
        db.updateUserTableWithoutPassword(
            req.session.user.userId,
            req.body.first,
            req.body.last,
            req.body.email
        ).catch(err => {
            console.log("Error in updateUserTableWithoutPassword:", err);
            res.render("profileEdit", {
                layout: "main",
                error: true
            });
        });
    }

    db.updateProfileTable(
        req.body.age,
        req.body.city,
        req.body.url,
        req.session.user.userId
    )
        .then(result => {
            res.redirect("/petition");
        })
        .catch(err => {
            console.log("Error in updateProfileTable: ", err);
            res.render("profileEdit", {
                layout: "main",
                error: true
            });
        });
});

app.listen(process.env.PORT || 8080, () =>
    console.log("Ready to sign something.")
);
