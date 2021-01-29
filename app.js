const dotenv = require("dotenv");
const express = require("express");
const path = require("path");

const indexRouter = require('./routes/index');

dotenv.config();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//give homepage
app.use('/', indexRouter);


app.listen(3000, function() {
    console.log('listening on 3000')
})

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get(`${process.env.NODE_ENV}`) === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
    console.error('error');
});

module.exports = app;