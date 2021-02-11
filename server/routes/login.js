const express = require('express');
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URL;
const bcrypt = require("bcrypt");
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('login');
});

router.post('/', (req, res, next) => {
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
        findAndLoginUser();
        async function findAndLoginUser() {
            // continue here.
            MongoClient.connect(uri, {
                useUnifiedTopology: true,
                useNewUrlParser: true
            }).then(client => {
                const users = client.db("twitclone").collection("users");
                users.findOne({email: email}, (err, result)=>{
                    if(!result){
                        res.status(404).send({message: "user doesnt exist", success: false});
                        res.end;
                    }
                })
            }).catch(err => {
                console.error(err);
                res.sendStatus(500);
            });
        }

    } else {
        res.status(401).send({ "error": errors, "success": false });
    }

});


module.exports = router;