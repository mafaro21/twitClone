const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const redis = require("redis");
const uri = process.env.MONGO_URL;
const isLoggedin = require('../middleware/authchecker');
const { ProfileValidation } = require("../middleware/inputvalidation");
const MongoOptions = { useUnifiedTopology: true, useNewUrlParser: true };
const router = express.Router();


/** CONNECT to REDIS */
const redisClient = redis.createClient({
    host: process.env.REDIS_URI,
    port: process.env.REDIS_PORT || 14847,
    password: process.env.REDIS_PASSWORD,
});



/* GETTING MY OWN PROFILE */
router.get("/mine", isLoggedin, (req, res, next) => {
    const userid = req.session.user.id;
    /**
     * GET from redis. 
     * If redis = NULL, fetch data from Mongodb,
     * then store in redis for future requests.
     */
    redisClient.hgetall(userid, (err, reply) => {
        if (err) next(err);
        if (!reply) fetchfromMongo();
        else {
            return res.status(200).send([reply]);
        }
    });

    function fetchfromMongo() {
        MongoClient.connect(uri, MongoOptions).then(async client => {
            const users = client.db("twitclone").collection("users");
            const projection = { password: 0, email: 0 }; // <--exclusions
            try {
                const result = await users.findOne({ _id: new ObjectId(userid) }, { projection: projection });
                //save RESULT TO REDIS HashSet.
                savetoRedis(result);
                res.status(200).send([result]);
            } catch (error) {
                res.sendStatus(404);
                console.error(error);
            } finally {
                await client.close();
            }
        }).catch(next);
    }

    async function savetoRedis(result) {
        redisClient.hmset(userid, {
            "_id": userid,
            "fullname": result.fullname,
            "username": result.username,
            "bio": result.bio,
            "datejoined": result.datejoined,
            "followers": `${result.followers}`,
            "following": `${result.following}`,
        }, (err, reply) => {
            if (err) return console.error("REDIS_HASH", err);
            console.log("REDIS HashSet", reply);
        });
    }
});


/*  GETTING ANOTHER user profile */
router.get("/user/:username", (req, res, next) => {
    const username = req.params.username;
    const viewerId = getSafe(() => req.session.user.id, 0);  //current viewer (if Loggedin)
    const userReg = /[^0-9a-zA-Z_\S]+/;
    //check if valid username format:
    if (userReg.test(username)) return res.sendStatus(404);
    if (username.length > 20) return res.sendStatus(404);
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
router.put("/mine/edit", isLoggedin, ProfileValidation, (req, res, next) => {
    const userid = req.session.user.id;
    const { fullname, username, bio } = req.body;

    //connect to db
    MongoClient.connect(uri, MongoOptions).then(async (client) => {
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

redisClient.on('error', (error) => {
    console.error(error.message);

});

/*error handler */
router.use((err, req, res, next) => {
    res.status(500).send({ message: "Oops! Something went wrong :(" });
    console.error("UPDATErr", err);
});

module.exports = router;
