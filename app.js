require("dotenv").config();
const express = require("express");
const path = require("path");
const port = process.env.PORT || 3000;

const indexRouter = require('./routes/index');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Serve pages
app.use('/', indexRouter);


app.get("/register", (req, res) => {
    res.render('register', { title: 'TwitClone : Register' });
});

app.post("/register", (req, res, next) => {
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
            errors.push("Name contains illegal characters ");
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
    if (checkInputs() === true ) {
         res.status(200).json(req.body);
         console.json(req.body);
    } else {
        var err = new Error('Could not sign you up');
        err.status = 422;
        err.message = errors;
        next(err);  
        //console.error(errors);
    }
})

//listening ports
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})

// if visiting non-existing page, serve error 404
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
    //pass this to error handler below
});


// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
    console.error(err.status);
});

module.exports = app;