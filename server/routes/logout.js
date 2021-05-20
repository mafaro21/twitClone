const express = require("express");
const isLoggedin = require("../middleware/authchecker");
const router = express.Router();
const redis = require("redis");

/** CONNECT to REDIS */
const redisClient = redis.createClient({
    host: process.env.REDIS_URI,
    port: process.env.REDIS_PORT || 14847,
    password: process.env.REDIS_PASSWORD,
});


router.get("/", isLoggedin, (req, res, next) => {
    /** clear REDIS info for the user. */
    redisClient.del(req.session.user.id, (err, reply) => {
        if (err) throw err;
        else {
            destroySession();
            console.log(reply);
        }
    });

    function destroySession() {
        req.session.destroy((err) => {
            if (err) throw err;
            return res.send({ message: "logged out", success: true });
        });
    }
});

module.exports = router;
