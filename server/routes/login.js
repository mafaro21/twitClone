const express = require("express");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;
const secret = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const axios = require("axios").default;
const router = express.Router();
const rateLimit = require("express-rate-limit"); //store it later in REDIS


//setup rate limit
const LoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins window
    max: 5, // start blocking after 5 requests
    skipSuccessfulRequests: true,
    message: { "message": "Too many tries, try again in 15 mins" }
});


//FOR LOGIN ONLY::

/* handling GET requests  */
router.get("/", (req, res) => {
    res.send({ "title": " Twitclone Login" });
});

/* handling POST requests */
router.post("/", LoginLimiter, (req, res, next) => {
    const { email, password, responseToken } = req.body;
    let errors = []; // input errors
    let isValid = false; // captcha result

    function checkInputs() {
        let OK = true;
        let emailpatt = /(^([0-9A-Za-z])[\w\.\-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;

        if (!emailpatt.test(email) || !email || !password) {
            errors.push("Invalid or empty inputs");
            return false;
        }
        return OK;
    };

    //-----------------BEGIN CAPTCHA VERIFICATION ---------------------------//
    const checkInputsResult = checkInputs();
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
            if ((isValid && checkInputsResult) === false) {
                res.status(422).send({ "message": errors, "success": false });
            }
            else operateDB();
        })
        .catch(err => {
            res.status(400).send({ "message": "CAPTCHA Error" });
            console.error("AXIOS", err.message);
        });
    //---------------------END OF VERIFICATION ABOVE ---------------------//

    function operateDB() {
        //continue with LOGIN operations
        MongoClient.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }).then(async (client) => {
            const users = client.db("twitclone").collection("users");
            try {
                const result = await users.findOne({ email: email });
                if (!result) {
                    throw new Error("User doesn\'t exist");
                }
                let hashedPass = result.password;
                let match = await bcrypt.compare(password, hashedPass);
                if (!match)
                    throw new Error("Wrong email or password");
                else {
                    // BINGO! User authenticated. Now, create session.
                    req.session.user = { id: result._id, email: result.email };
                    res.status(200).send({ "success": true });
                }
            } catch (error) {
                res.status(401).send({ "message": error.message });
            } finally {
                await client.close();
            }
        }).catch(next);
    } // <--end of function

});


/*error handler */
router.use((err, req, res) => {
    res.sendStatus(500);
    console.error(err.message);
});

module.exports = router;