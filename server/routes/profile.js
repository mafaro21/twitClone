const express = require("express");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;
const isLoggedin = require('../middleware/authchecker');
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
        const projection = { _id: 0, password: 0, email: 0 }; // <--exclusions
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


/* UPDATING MY PROFILE  */
router.put("/mine/edit", isLoggedin, (req, res, next) => {
    const userid = req.session.user.id;
    const { fullname, username, bio } = req.body;
    let errors = []; // input errors

    //do validation FIRST
    function checkInputs() {
        let OK = true;
        let reg = /^[ \p{Han}0-9a-zA-Z_\.\'\-]+$/;
        let userReg = /[^0-9a-zA-Z_\S]+/;
        let bioReg = /[<>]/;

        if (!fullname || !username || !bio) {
            //☹ if any empty, END immediately!
            errors.push("No field can be empty, ");
            return false;
        }
        if (!reg.test(fullname) || userReg.test(username) || bioReg.test(bio)) {
            errors.push("One or more fields contain illegal characters, ");
            OK = false;
        }
        if (bio.length > 100) {
            errors.push("Max length for bio exceeded");
            OK = false;
        }
        return OK;
    };

    const checkInputsResult = checkInputs();
    if (checkInputsResult === false) {
        res.status(422).send({ "message": errors, "success": false });
        return;
    } else updateUserData();

    //--------------------------END OF validation ABOVE ----------------------//

    function updateUserData() {
        MongoClient.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }).then(async (client) => {
            const users = client.db("twitclone").collection("users");
            const newValues = { fullname: fullname, username: username, bio: bio };
            try {
                const result = await users.updateOne({ _id: userid }, { $set: newValues });
                res.send({ "updated:": result.modifiedCount, "success": true });
            } catch (error) {
                if (error.code === 11000)
                    res.status(409).send({ "message": "Username has already been taken" });
                else throw error;
            } finally {
                await client.close();
            }
        }).catch(next);
    }
});


/*error handler */
router.use((err, req, res, next) => {
    res.sendStatus(500);
    console.error("UPDATErr", err);
});

module.exports = router;
