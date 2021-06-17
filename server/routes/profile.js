const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGO_URL;
const isLoggedin = require('../middleware/authchecker');
const { ProfileValidation } = require("../middleware/inputvalidation");
const rateLimit = require("express-rate-limit");
const MongoOptions = { useUnifiedTopology: true, useNewUrlParser: true };
const router = express.Router();


/** Limit the edit Profile to 3x per 15 mins window */
const EditLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: { "message": "Too many requests, try again after some time" }
});


/* GETTING MY OWN PROFILE */
router.get("/mine", isLoggedin, (req, res, next) => {
    const userid = req.session.user.id;
    /**
     * FETCH from redis. 
     * If redis = NULL, GET data from Mongodb,
     * then store in redis for future requests.
     */
    MongoClient.connect(uri, MongoOptions).then(async client => {
        const users = client.db("twitclone").collection("users");
        const projection = { password: 0, email: 0 }; // <--exclusions
        try {
            const result = await users.findOne({ _id: new ObjectId(userid) }, { projection: projection });
            res.status(200).send([result]);
        } catch (error) {
            res.sendStatus(404);
            console.error(error);
        } finally {
            await client.close();
        }
    }).catch(next);

});


/*  GETTING ANOTHER user profile */
router.get("/user/:username", (req, res, next) => {
    const username = req.params.username;
    const viewerId = getSafe(() => req.session.user.id, 0);  //current viewer (if Loggedin)
    const userReg = /[^0-9a-zA-Z_\S]/;
    //check if valid username format:
    if (userReg.test(username) || username.length > 20 ) return res.sendStatus(404);
   
    // above^ check if username length is over 20 chars
    const agg = [
        {
            $match: {
                username: username,
            }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "toUserId",
                as: "followed",
            }
        },
        {
            $project: {
                _id: 1,
                fullname: 1,
                username: 1,
                bio: 1,
                datejoined: 1,
                followers: 1,
                following: 1,
                isfollowedbyme: {
                    $in: [new ObjectId(viewerId), "$followed.fromUserId"]
                }
            }
        }
    ];

    //this is to avoid UNDEFINED Error for viewerId
    function getSafe(fn, defaultValue) {
        try {
            return fn();
        } catch (e) {
            return defaultValue;
        }
    }

    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const users = client.db("twitclone").collection("users");
            try {
                const result = await users.aggregate(agg).toArray();
                if (result.length === 0) throw new Error("User Not Found");
                res.status(200).send(result);
            } catch (error) {
                res.status(404).send({ "message": error.message });
            } finally {
                await client.close();
            }
        }).catch(next);

});

/**  UPDATING MY PROFILE  */
router.put("/mine/edit", EditLimiter, isLoggedin, ProfileValidation, (req, res, next) => {
    const userid = req.session.user.id;
    const { fullname, username, bio } = req.body;

    //connect to db
    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const users = client.db("twitclone").collection("users");
            const newValues = { fullname: fullname, username: username, bio: bio };
            try {
                await users.updateOne({ _id: new ObjectId(userid) }, { $set: newValues });
                //IF SUCCESS, UPDATE the Session variables
                req.session.user = { "id": userid, "username": username, "fullname": fullname };
                res.status(200).send({ "success": true });
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
    res.status(500).send({ message: "Oops! Something went wrong :(" });
    console.error("UPDATErr", err);
});

module.exports = router;
