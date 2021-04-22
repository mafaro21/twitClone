const express = require("express");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;
const isLoggedin = require('../middleware/authchecker');
const { ProfileValidation } = require("../middleware/inputvalidation");
const router = express.Router();


/* GETTING MY PROFILE */
router.get("/mine", isLoggedin, (req, res, next) => {
    const userid = req.session.user.id;
    //retrieve data from db
    MongoClient.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then(client => {
        const users = client.db("twitclone").collection("users");
        const projection = { _id: 0, password: 0, email: 0 }; // <--exclusions
        users.findOne({ _id: userid }, { projection: projection }, (err, result) => {
            if (!result) res.sendStatus(404);
            else res.send(result);
            client.close();
        });
    }).catch(next);
});


/*  GETTING ANOTHER user profile */
router.get("/user/:username", (req, res, next) => {
    const username = req.params.username;
    const userReg = /[^0-9a-zA-Z_\S]+/;
    //check if valid username format:
    if (userReg.test(username)) return res.sendStatus(404);

    MongoClient.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then(async (client) => {
        const users = client.db("twitclone").collection("users");
        const projection = { password: 0, email: 0 }; // <--exclusions
        try {
            const result = await users.findOne({ username: username }, { projection: projection });
            if (!result) throw new Error("User Not Found");
            res.status(200).send(result);
        } catch (error) {
            res.status(404).send(error.message);
            console.error(error);
        } finally {
            await client.close();
        }
    }).catch(next);

});

/**  UPDATING MY PROFILE  */
router.put("/mine/edit", isLoggedin, ProfileValidation, (req, res, next) => {
    const userid = req.session.user.id;
    const { fullname, username, bio } = req.body;

    //connect to db
    MongoClient.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then(async (client) => {
        const users = client.db("twitclone").collection("users");
        const newValues = { fullname: fullname, username: username, bio: bio };
        try {
            await users.updateOne({ _id: userid }, { $set: newValues });
            //IF SUCCESS, UPDATE the Session variables
            req.session.user = { "id": userid, "username": username };
            res.status(200).send({  "success": true });

        } catch (error) {
            if (error.code === 11000)
                res.status(409).send({ "message": "Username has already been taken" });
            else throw error;
        } finally {
            await client.close();
        }
    }).catch(next);

});


/*error handler */
router.use((err, req, res, next) => {
    res.sendStatus(500);
    console.error("UPDATErr", err);
});

module.exports = router;
