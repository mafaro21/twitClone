const express = require('express');
const router = express.Router();

//FOR REGISTER requests ONLY:: i.e.  '/register'
/* handling GET requests  */
router.get("/", (req, res, next) => {
    res.render('register', { errors: JSON.stringify([""]) });
});

/* handling POST requests */
router.post("/", (req, res, next) => {
    const fullname = req.body.fullname;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPass = req.body.confirmPass;
    var errors = [];

    function checkInputs() {
        var YY = true;
        var reg = new RegExp('[^ a-zA-Z0-9_]');
        var patt = /(^([0-9A-Za-z])[\w\.-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;

        if (reg.test(fullname)) {
            errors.push("Name contains illegal characters");
            YY = false
        }
        if (!patt.test(email)) {
            errors.push("Required 8 or more characters");
            YY = false;
        }
        if (password.length < 8) {
            errors.push("Required 8 or more characters");
            YY = false;
        }
        if (password !== confirmPass) {
            errors.push("Passwords do not match");
            YY = false;
        }
        return YY;
    }
    if (checkInputs() === true) {
        res.status(200).json(req.body);
        console.json(req.body);
    } else {
        res.status(422);
        res.render('register', { errors: JSON.stringify(errors) });
        console.error(errors);
    }
});


module.exports = router;