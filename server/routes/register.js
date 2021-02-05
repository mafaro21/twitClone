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
    var errors = [];


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
            const users = client.db('twitclone').collection("users");
            users.insertOne(userObject, (error, result) => {
                // handle ERRORS WELL!!!!
                if (error) throw error; // <------------ handle ERRORS PROPERLY w/o CRASHING SERVER!!!!
                console.log(result.ops);
                res.status(201).send({ "user": result.ops[0], "success": true });
                client.close();
            });
        }).catch(err => {
            res.sendStatus(500);
            console.error(err);
        });
    } else {
        res.status(422).send({ "errors": errors, "success": false });
    }

});


module.exports = router;
