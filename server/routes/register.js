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
            var OK = true;
            var reg = new RegExp('[^ a-zA-Z0-9_]');
            var emailpatt = /(^([0-9A-Za-z])[\w\.-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;

            if (reg.test(fullname)) {
                errors.push("Name contains illegal characters");
                OK = false;
            }
            if (!emailpatt.test(email)) {
                errors.push("Required 8 or more characters");
                OK = false;
            }
            if (password.length < 8) {
                errors.push("Required 8 or more characters");
                OK = false;
            }
            if (password !== confirmPass) {
                errors.push("Passwords do not match");
                OK = false;
            }
            return OK;
        }
        if (checkInputs() === true) {
            res.status(201).send( {"user": req.body} );
           // res.send( {'user:' : req.body});
            console.log(JSON.parse(req.body.toString()));
        } else {
           res.status(422);
           res.render('register', { errors: JSON.stringify(errors) });
        }
    
});


module.exports = router;
