const express = require("express");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;
const secret = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const axios = require("axios").default;
const router = express.Router();
const MongoOptions = { useUnifiedTopology: true, useNewUrlParser: true };
const rateLimit = require("express-rate-limit"); //store it later in REDIS
const { LoginValidation } = require("../middleware/inputvalidation");


//setup rate limit
const LoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: { "message": "Too many tries, try again in 15 mins" }
});


//FOR LOGIN ONLY::

/* handling GET requests  */
router.get("/", (req, res, next) => {
    res.send({ "title": " Twitclone Login" });
});

/* handling POST requests */
router.post("/", LoginLimiter, LoginValidation, (req, res, next) => {
    const { email, password, responseToken } = req.body;
    let isValid = false; // captcha result
   
    //------------------------ BEGIN CAPTCHA VERIFICATION -----------------------//
    const axiosOptions = {
        url: process.env.VERIFY_LINK,
        method: "POST",
        timeout: 5000,
        params: {
            secret: secret,
            response: responseToken
        }
    };

    axios.request(axiosOptions)
        .then(res => {
            isValid = res.data.success && (res.data.score >= 0.5); //check if both TRUE
            let prob = res.data['error-codes'];
            if (prob) throw prob;
            return isValid;
        })
        .then(isValid => {
            if (isValid === true) operateDB();
            else throw new Error();
        })
        .catch(err => {
            res.status(401).send({ "message": "CAPTCHA Error" });
            console.error("AXIOS", err.message);
        });
    //---------------------END OF VERIFICATION ABOVE ---------------------//

    function operateDB() {
        //continue with LOGIN operations
        console.time("login")
        MongoClient.connect(uri, MongoOptions)
            .then(async (client) => {
                const users = client.db("twitclone").collection("users");
                try {
                    const result = await users.findOne({ email: email });
                    if (!result) {
                        throw new Error("User doesn\'t exist");
                    }
                    let hashedPass = result.password;
                    const match = await bcrypt.compare(password, hashedPass);
                    if (!match) {
                        throw new Error("Wrong email or password! Try again.");
                    }
                    // BINGO! User authenticated. Now, create session.
                    req.session.user = { "id": result._id, "username": result.username, "fullname": result.fullname };
                    res.status(200).send({ "success": true });
                    console.timeEnd("login");
                } catch (error) {
                    res.status(401).send({ "message": error.message });
                } finally {
                    await client.close();
                }
            }).catch(next);
    } // <--end of function

});


/*error handler */
router.use((err, req, res, next) => {
    res.status(500).send({ message: "Oops! Something went wrong :(" });
    console.error("LOGINeRR", err.message);
});

module.exports = router;