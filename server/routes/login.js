const express = require("express");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;
const secret = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const axios = require('axios').default;
const router = express.Router();

router.get("/", (req, res, next) => {
    res.render("login", { "title": "Twitclone: Login" });
});

router.post("/", (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const responseToken = req.body.responseToken;
    let isValid = false; // captcha result

    function checkInputs() {
        var OK = true;
        var emailpatt = /(^([0-9A-Za-z])[\w\.\-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;

        if (!emailpatt.test(email) || !email || !password) {
            OK = false;
        }
        return OK;
    };

    //email has valid format. So proceed
    const axiosOptions = {
        url: process.env.VERIFY_LINK,
        method: "POST",
        params: {
            secret: secret,
            response: responseToken
        }
    };
    axios.request(axiosOptions)
        .then(res => {
            isValid = res.data.success && (res.data.score >= 0.5); //check if both TRUE
            return isValid;
        })
        .then(isValid => {
            if ((isValid && checkInputs()) === false) {
                errors.push("CAPTCHA failed");
                res.status(422).send({ "message": errors, "success": false });
                res.end();
            } else {
                operateDB();
            };
        }).catch(err => {
            console.error(err.response.data);
            res.sendStatus(500);
        });


    function operateDB() {
        //continue with LOGIN operations
        MongoClient.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }).then((client) => {
            const users = client.db("twitclone").collection("users");
            users.findOne({ email: email }, (error, result) => {
                if (!result) {
                    res.status(401).send({ "message": "User doesnt exist", "success": false });
                    res.end();
                } else {
                    // Continue. verify password.      
                    loginUser();
                    async function loginUser() {
                        let hashedPass = result.password;
                        let match = await bcrypt.compare(password, hashedPass);
                        if (!match)
                            res.status(401).send({ "message": "Wrong email or password", "success": false });
                        else {
                            // BINGO! User authenticated. Now, create session.
                            res.status(200).send({ "success": true });
                        }
                    }
                }
                client.close();
            });
        }).catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
    }
});


module.exports = router;
