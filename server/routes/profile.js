const express = require("express");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;
const isLoggedin = require('../middleware/authchecker');
const router = express.Router();

//FOR PROFILE //


/* GETTING MY PROFILE */
router.get("/mine", isLoggedin, (req, res, next) => {
    let userid = req.session.user.id;
    //retrieve data from db
    MongoClient.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
        .then(client => {
            const users = client.db('twitclone').collection('users');
            const projection = { _id: 0, password: 0, email: 0 }; // <--exclusions
            users.findOne({ _id: userid }, { projection: projection }, (err, result) => {
                if (!result) res.sendStatus(404);
                else res.json(result);
                client.close();
            });
        }).catch(next);
});

/*  GETTING OTHER user profile */
router.get("/user/:userid", (req, res, next) => {
    let userid = req.params.userid;
    res.send(`Profile belongs to  ${userid}`);
});

/* handling UPDATE MY PROFILE  */
router.put("/mine/edit", isLoggedin, (req, res, next) => {
    let userid = req.session.user.id;
    const { fullname, username, bio } = req.body;

    //do validation first
    function checkInputs() {
        let OK = true;
        let reg = new RegExp("[^ a-zA-Z0-9_\\.]");
        let userReg = /^[\w\S]+$/gi;

        if (!fullname || !username || !bio) {
            //☹ if any empty, END immediately!
            errors.push("No field can be empty, ");
            return false;
        }
        if (reg.test(fullname)) {
            errors.push("Name contains illegal characters, ");
            OK = false;
        }
        if (userReg.test(username)) {
            errors.push("Username contains illegal characters, ");
            OK = false;
        }
        if (reg.test(bio)) {
            errors.push("Bio contains illegal characters, ");
            OK = false;
        }
        return OK;
    };
    //--------------here--------------------//
    const checkInputsResult = checkInputs();

    function updateUserData() {
        MongoClient.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }).then(client => {
            const users = client.db('twitclone').collection('users');
            const newValues = { fullname: '', username: '', bio: '' }; // <--newValues
            users.updateOne({ _id: userid }, { $set: newValues }, (err, result) => {
                if (err) {
                    res.status(400).send({ "message": err.message, "success": false });
                    res.end();
                    console.error(err);
                } else {
                    //RE-WrITE THE SESSION VARIABLES HERE.
                    res.json({ "message": result.modifiedCount, "success": true });
                }
                client.close();
            });
        }).catch(next);    
    }

});

/*error handler */
router.use((err, req, res, next) => {
    res.sendStatus(500);
    console.error(err);
});

module.exports = router;