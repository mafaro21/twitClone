//MY CUSTOM middleware FUNCTIONS

/** FOR validating REGISTER requests */
const RegValidation = (req, res, next) => {
    let errors = []; // input errors
    const { fullname, email, password, confirmPass } = req.body;

    function checkInputs() {
        let OK = true;
        let reg = /^[ \p{Han}0-9a-zA-Z_\.\'\-]+$/;
        let emailpatt = /(^([0-9A-Za-z])[\w\.\-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;

        if (!fullname || !email || !password || !confirmPass) {
            //☹ if any empty, END immediately!
            errors.push("No field can be empty, ");
            return false;
        }
        if (!reg.test(fullname)) {
            errors.push("Name contains illegal characters, ");
            OK = false;
        }
        if (!emailpatt.test(email)) {
            errors.push("Email is invalid, ");
            OK = false;
        }
        if (password.length < 8) {
            errors.push("Required 8 or more characters, ");
            OK = false;
        }
        if (password !== confirmPass) {
            errors.push("Passwords do not match, ");
            OK = false;
        }
        return OK;
    };
    const RegValidationResult = checkInputs();
    if (RegValidationResult === false) {
        return res.status(422).send({ "message": errors, "success": false });
    } else next();

};

/** For Validating LOGIN posts */
const LoginValidation = (req, res, next) => {
    const { email, password } = req.body;
    let errors = []; // input errors

    function checkInputs() {
        let OK = true;
        let emailpatt = /(^([0-9A-Za-z])[\w\.\-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;

        if (!emailpatt.test(email) || !email || !password) {
            errors.push("Invalid or empty inputs");
            return false;
        }
        return OK;
    };
    const LoginValidationResult = checkInputs();
    if (LoginValidationResult === false) {
        return res.status(422).send({ "message": errors, "success": false });
    } else next();
};


/** for Validating Tweet posts */
const TweetValidation = (req, res, next) => {
    const { content } = req.body;
    let errors = []; // input errors

    //-----------START VALIDATION------------//
    function checkInputs() {
        let OK = true;
        const reg = /[><]+/;

        if (!content || content.length < 1) {
            errors.push("Body cannot be empty");
            return false;
        }
        if (content.length > 280) {
            errors.push("Max. length of tweet exceeded");
            return false;
        }
        if (reg.test(content)) {
            errors.push("Tweet contains invalid characters");
            OK = false;
        }
        return OK;
    }
    const TweetValidationResult = checkInputs();
    if (TweetValidationResult === false) {
        res.status(422).send({ "message": errors, "success": false });
        return;
    } else next();
};

/** for Validating Profile Updates */
const ProfileValidation = (req, res, next) => {
    const { fullname, username, bio } = req.body;
    let errors = []; // input errors

    //do validation FIRST
    function checkInputs() {
        let OK = true;
        let reg = /^[ \p{Han}0-9a-zA-Z_\.\'\-]+$/;
        let userReg = /[^0-9a-zA-Z_\S]+/;
        let bioReg = /[<>]/;

        if (!fullname || !username || !bio) {
            //☹ if any empty, END immediately!
            errors.push("No field can be empty, ");
            return false;
        }
        if (!reg.test(fullname) || userReg.test(username) || bioReg.test(bio)) {
            errors.push("One or more fields contain illegal characters, ");
            OK = false;
        }
        if (bio.length > 100) {
            errors.push("Max length for bio exceeded");
            OK = false;
        }
        return OK;
    };

    const checkInputsResult = checkInputs();
    if (checkInputsResult === false) {
        res.status(422).send({ "message": errors, "success": false });
        return;
    } else next();
};

module.exports = { RegValidation, LoginValidation, TweetValidation, ProfileValidation };