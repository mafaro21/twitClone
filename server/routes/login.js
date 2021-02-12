const express = require("express");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.render("login", {"title" : "Twitclone: Login"});
});

router.post("/", (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    var emailpatt = /(^([0-9A-Za-z])[\w\.-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;

    if (!emailpatt.test(email)) {
        res.status(401).send({ message: "Invalid email", success: false});
        res.end();
    }
    else {
        //email is valid. So proceed
        MongoClient.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }).then((client) => {
            const users = client.db("twitclone").collection("users");
            users.findOne({ email: email }, (error, result) => {
                if (result == null) {
                    res.status(401).send({ "message": "User not found", "success": false });
                } else {
                    //login the user + create Session
                    loginUser();
                    async function loginUser() {
                        let hashedPass = result.password;
                        let match = await bcrypt.compare(password, hashedPass);
                        if (!match)
                            res.status(401).send({ "message": "Wrong email or password", "success": false });
                        else {
                            // BINGO! User authenticated. Now create session.
                            res.status(200).send({ "success": true });
                        }
                    }
                }
            });
        }).catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
    }
});

module.exports = router;
