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
  res.render('register', { title: 'TwitClone : Register'});
  console.log("we are on register page");
});

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