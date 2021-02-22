const express = require('express');
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URL;
const secret = process.env.SECRET_KEY;
const bcrypt = require('bcrypt');
const axios = require('axios').default;
const router = express.Router();

//FOR REGISTER ONLY::

/* handling GET requests  */
router.get("/", (req, res, next) => {
    res.render('register', { errors: JSON.stringify([""]) });
});

/* handling POST requests */
router.post("/", (req, res, next) => {
    const fullname = req.body.fullname;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPass = req.body.confirmPass;
    const responseToken = req.body.responseToken;
    var errors = []; // input errors
    var isValid = false; // captcha result

    function checkInputs() {
        var OK = true;
        var reg = new RegExp("[^ a-zA-Z0-9_]");
        var emailpatt = /(^([0-9A-Za-z])[\w\.\-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;

        if (!fullname || !email || !password || !confirmPass) {
            //☹ if any empty, END immediately!
            errors.push("No field can be empty");
            return false;
        }
        if (reg.test(fullname)) {
            errors.push("Name contains illegal characters");
            OK = false;
        }
        if (!emailpatt.test(email)) {
            errors.push("Email is invalid.");
            OK = false;
        }
        if (password.length < 8) {
            errors.push("Required 8 or more characters");
            OK = false;
        }
        if (password !== confirmPass) {
            errors.push("Passwords do not match");
            OK = false;
        }
        return OK;
    };
    const axiosOptions = {
        url: "https://www.google.com/recaptcha/api/siteverify",
        method: "POST",
        params: {
            secret: secret,
            response: responseToken
        }
    };
    axios.request(axiosOptions)
        .then(res => {
            console.log(res.data);
            isValid = res.data.success;
            let prob = res.data['error-codes'];
            if (prob) errors.push(prob);
            return isValid;
        }).then(isValid => {
            if ((isValid && checkInputs()) === false) {
                res.status(422).send({ "message": errors, "success": false });
                res.end();
            } else {
                res.status(200).send({ "message": 'NOT A ROBOT', "success": true });
                // addUserToDatabase(); 
            };
        }).catch(err => {
            console.error(err);
        });

    async function addUserToDatabase() {
        let randnum = Math.floor(Math.random() * 100 - 10);
        let newPass = await bcrypt.hash(password, 10);
        const userObject = {
            fullname: fullname,
            username: email.split(/[^a-zA-Z0-9]/)[0] + randnum,
            email: email,
            password: newPass,
            datejoined: new Date(),
        };

        MongoClient.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }).then(client => {
            const users = client.db("twitclone").collection("users");
            users.insertOne(userObject, (error, result) => {
                if (error) {
                    //next(error); /* for EJS exclusive apps only */
                    console.error(error);
                    res.status(422).json({ "message": error.message, "success": false });
                } else {
                    console.log(result.ops);
                    //Now, create session here.
                    res.status(201).json({ "userCreated": result.insertedCount, "success": true });
                }
                client.close();
            });
        }).catch(err => {
            res.sendStatus(500);
            console.error(err);
        });
    }; // <--end of function

});

module.exports = router;
