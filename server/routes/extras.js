const express = require("express");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;
const router = express.Router();
const redis = require("redis");
const rateLimit = require("express-rate-limit");
const MongoOptions = { useUnifiedTopology: true, useNewUrlParser: true };

/** CONNECT to REDIS */
const redisClient = redis.createClient({
    host: process.env.REDIS_URI,
    port: process.env.REDIS_PORT || 14847,
    password: process.env.REDIS_PASSWORD,
});

/** setup rate limit */
const SearchLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins window
    max: 20, // block after 20 requests
    message: { "message": "Too many tries, try again after some time" }
});

router.get("/search", SearchLimiter, (req, res, next) => {
    const username = req.query.user;
    const userReg = /[^0-9a-zA-Z_\S]+/;

    if (!username || userReg.test(username) || username.length > 20 || username.length < 4) {
        return res.sendStatus(400);
    }

    /*     (async () => {
            redisClient.scan("0", "MATCH", `*${username}*`, (err, reply) => {
                if (err) next(err);
                else if (reply[1].length === 0) fetchfromMongo();
                else {
                    res.status(200).send(reply[1]);
                    console.log(reply[1]);
                }
            });
        })(); 
        */

    MongoClient.connect(uri, MongoOptions)
        .then(async client => {
            const users = client.db("twitclone").collection("users");
            const projection = { _id: 1, username: 1, fullname: 1 }; // <--INCLUSIONS
            const myquery = { $regex: new RegExp(username), $options: "i" };
            try {
                const result = await users.find({ username: myquery })
                    .project(projection)
                    .limit(10)
                    .toArray();
                if (result.length === 0) throw new Error("No results for this username");
                res.status(200).send(result);
            } catch (error) {
                res.status(404).send({ "message": error.message });
            } finally {
                await client.close();
            }
        }).catch(next);

});

/** @returns TOP 3 USERS BY FOLLOWERS */
router.get("/topusers", SearchLimiter, (req, res, next) => {

/** 
 * 1. fetch from REDIS
 * 2. IF REDIS == NULL, fetch from mongodb
 * 3. save result to redis for a 3 day lifespan.
 */

    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const users = client.db("twitclone").collection("users");
            const projection = { _id: 1, username: 1, fullname: 1 }; // <--INCLUSIONS
            try {
                const result = await users.find({})
                    .sort({_id: -1, followers: -1 })
                    .limit(3)
                    .project(projection)
                    .toArray();
                res.status(200).send(result);
            } catch (error) {
                res.status(404).send({ message: error.message });
                console.error("top3", error.message);
            } finally {
                await client.close();
            }
        }).catch(next);
});

/*error handler */
router.use((err, req, res, next) => {
    res.status(500).send({ message: "Oops! Something went wrong :(", success: false, });
    console.error("EXTRA_err", err);
});


module.exports = router;
