app.get("/registration", (req, res) => {
    res.render("registration", {
        layout: "main"
    });
});

app.post("/registration", (req, res) => {
    console.log("abrakadabra");
});

/////

app.get("/signers/:city", (req, res) => {
    console.log(req.params.city);
});


user_id REFERENCES user(id)
