const express = require("express");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;
const router = express.Router();
const redis = require("redis");
const rateLimit = require("express-rate-limit");
const isLoggedin = require("../middleware/authchecker");
const MongoOptions = { useUnifiedTopology: true, useNewUrlParser: true };

/** CONNECT to REDIS */
const redisClient = redis.createClient({
    host: process.env.REDIS_URI,
    port: process.env.REDIS_PORT || 14847,
    password: process.env.REDIS_PASSWORD
});

/** setup rate limit */
const SearchLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins window
    max: 20, // block after 20 requests
    message: { message: "Too many tries, try again after some time" }
});

/** SEARCH FOR USERNAME */
router.get("/search", SearchLimiter, (req, res, next) => {
    const username = req.query.user;
    const userReg = /[^0-9a-zA-Z_\S]/;

    if (!username || userReg.test(username) || username.length > 20 || username.length < 4) {
        return res.sendStatus(400);
    }

    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const users = client.db("twitclone").collection("users");
            const projection = { _id: 1, username: 1, fullname: 1 }; // <--INCLUSIONS
            const myquery = { $regex: new RegExp(username), $options: "i" };
            try {
                const result = await users.find({ username: myquery })
                    .project(projection)
                    .limit(10)
                    .toArray();
                if (result.length === 0) throw new Error("No results!");
                res.status(200).send(result);
            } catch (error) {
                res.status(404).send({ message: error.message });
            } finally {
                await client.close();
            }
        }).catch(next);
});

/** TOP 3 USERS BY FOLLOWERS */
router.get("/top3users", isLoggedin, (req, res, next) => {
    /**
     * 1. fetch from REDIS
     * 2. IF REDIS == NULL, fetch from MongoDb
     * 3. store result to redis for a 5 day lifespan.
     */
    redisClient.get("top3users", (err, reply) => {
        if (err) return next(err);
        if (!reply) fetchfromMongo();
        else res.status(200).send(JSON.parse(reply));
    });

    // called if REDIS retuns null
    function fetchfromMongo() {
        MongoClient.connect(uri, MongoOptions)
            .then(async (client) => {
                const users = client.db("twitclone").collection("users");
                const projection = { _id: 1, username: 1, fullname: 1 }; // <--INCLUSIONS
                try {
                    const result = await users.find({})
                        .sort({ _id: -1, followers: -1 })
                        .limit(3)
                        .project(projection)
                        .toArray();
                    // store for later use (async)
                    StoreInRedis(result);
                    if (result.length === 0) throw new Error("No results");
                    res.status(200).send(result);
                } catch (error) {
                    res.sendStatus(404);
                    console.error(error.message);
                } finally {
                    await client.close();
                }
            }).catch(next);
    }

    /** Cache the result in Redis */
    const StoreInRedis = async (result) => {
        redisClient.set("top3users", JSON.stringify(result), (err, reply) => {
            if (err) console.error("REDIS_JSON", err);
            console.log("REDIS_JSON", reply);
        });

        redisClient.expire("top3users", 60 * 60 * 24 * 5, (err, reply) => {
            if (err) console.error("REDIS_EXPIRE", err);
        });
    };

});

/*error handler */
router.use((err, req, res, next) => {
    res.status(500).send({
        message: "Oops! Something went wrong :(",
        success: false
    });
    console.error("EXTRA_err", err);
});

module.exports = router;
