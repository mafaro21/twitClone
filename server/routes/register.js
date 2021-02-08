const express = require('express');
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URL;
const router = express.Router();


//FOR REGISTER requests ONLY:: i.e.  '/register'
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
    var errors = []; // input errors


    function checkInputs() {
        var OK = true;
        var reg = new RegExp('[^ a-zA-Z0-9_]');
        var emailpatt = /(^([0-9A-Za-z])[\w\.-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;

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
    }
    if (checkInputs() === true) {
        const userObject = {
            fullname: fullname,
            username: email.split('@')[0],
            email: email,
            password: password,
            datejoined: new Date(),
        };
        MongoClient.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }).then(client => {
            const users = client.db("twitclone").collection("users");
            users.insertOne(userObject, (error, result) => {
                if (error) {
                    console.error(error);
                    res.status(422).send({ "message":  error.message, "success": false} );
                } else {
                    console.log(result.ops);
                    res.status(201).send({ "userAdded": result.insertedCount, "success": true })
                }
                client.close();
            })
        }).catch(err => {
            res.sendStatus(500);
            console.error(err);
        });
    } else {
        res.status(422).send({ "error": errors, "success": false });
    }
});


module.exports = router;
