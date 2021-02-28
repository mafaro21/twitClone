const express = require("express");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;
const secret = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const axios = require('axios').default;
const router = express.Router();
const rateLimit = require("express-rate-limit");


//setup rate limit
const LoginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message: { "message": "Too many tries, try again in 1 hour", "success": false }
});


//FOR LOGIN ONLY::

/* handling GET requests  */
router.get("/", (req, res, next) => {
    res.render("login", { "title": "Twitclone: Login" });
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
            if (prob) errors.push("CAPTCHA error");
            return isValid;
        })
        .then(isValid => {
            if ((checkInputsResult) === false) {
                res.status(422).send({ "message": errors, "success": false });
            }
            else operateDB(); // <-- HURRAY!😀 Call this fn now.
        })
        .catch(err => {
            res.sendStatus(500);
            console.error("AXIOS", err.message);
        });
    //---------------------END OF VERIFICATION ABOVE ---------------------//

    function operateDB() {
        //continue with LOGIN operations
        MongoClient.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }).then((client) => {
            const users = client.db("twitclone").collection("users");
            users.findOne({ email: email }, (error, result) => {
                if (!result) {
                    res.status(401).send({ "message": "User doesnt exist", "success": false });
                    res.end();
                } else {
                    // Continue. verify password.      
                    loginUser();
                    async function loginUser() {
                        let hashedPass = result.password;
                        let match = await bcrypt.compare(password, hashedPass);
                        if (!match)
                            res.status(401).send({ "message": "Wrong email or password", "success": false });
                        else {
                            // BINGO! User authenticated. Now, create session.
                            req.session.user = { id: result._id, email: result.email };
                            res.status(200).send({ "success": true });
                        }
                    }
                }
                client.close();
            });
        }).catch(next);
    } // <--end of function

});


/*error handler */
router.use((err, req, res, next) => {
    res.sendStatus(500);
    console.error(err.message);
});

module.exports = router;
