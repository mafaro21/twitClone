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

app.post("/register", (req, res) => {
    const fullname = req.body.fullname;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPass = req.body.confirmPass;

    console.log(req.body);

    function checkInputs() {
        var reg = new RegExp('[^ a-zA-Z0-9_]');
        var patt = /(^([0-9A-Za-z])[\w\.-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;

        if (reg.test(fullname)) {
            document.getElementById("errname").innerHTML = "Name contains illegal characters ";
            return false;
        }
        if (!patt.test(email)) {
            document.getElementById("errpwd").innerHTML = "Required 8 or more characters";
            return false;
        }
        if (password.length < 8) {
            document.getElementById("errpwd").innerHTML = "Required 8 or more characters";
            return false;
        }
        if (password !== confirmPass) {
            document.getElementById("errpwd2").innerHTML = "Passwords do not match";
            return false;
        }
    }
    if (checkInputs() == true) {
         res.send(req.body);
         console.log("hello");
        //res.send(`${fullname}, ${email}, ${password}, ${confirmPass}`, res.status);
    } else {
        console.log("error")
        res.json(res.body);
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