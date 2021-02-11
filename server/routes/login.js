const express = require("express");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.render("login");
});

router.post("/", (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    var errors = []; // input errors

    function checkInputs() {
        var OK = true;
        var emailpatt = /(^([0-9A-Za-z])[\w\.-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;

        if (!emailpatt.test(email)) {
            errors.push("Email is invalid.");
            OK = false;
        }
        if (password.length < 8) {
            errors.push("Required 8 or more characters");
            OK = false;
        }
        return OK;
    }
    if (checkInputs() === true) {
        MongoClient.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }).then((client) => {
            const users = client.db("twitclone").collection("users");
            users.findOne({ "": email }, (error, result) => {
                if (result == null) {
                    res.sendStatus(404);
                } else {
                    //login the user + create Session
                    loginUser();
                    async function loginUser() {
                        let hashedPass = result.password;
                        let match = await bcrypt.compare(password, hashedPass);
                        if (!match)
                            res.status(401).send({ "message": "Wrong email or password", "success": false });
                        else {
                            // BINGO! User authenticated. Please create session 
                        }
                    }
                }
            });
        }).catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
    } else {
        res.status(401).send({ "error": errors, success: false });
    }
});

module.exports = router;
