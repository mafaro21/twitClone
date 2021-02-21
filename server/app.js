require("dotenv").config();
const express = require("express");
const path = require("path");
const port = process.env.PORT || 5000;
const helmet = require("helmet");
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URL;

const app = express();


//import all routers
const indexRouter = require('./routes/index');
const toRegister = require('./routes/register');
const toLogin = require('./routes/login');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet({hsts: false}));

//Serve pages accordingly
app.use('/', indexRouter);
app.use('/register', toRegister);
app.use('/login', toLogin);

//listening port
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})

//connect to Mongodb
MongoClient.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(client => {
    const db = client.db('twitclone');
    console.log(`connected to database ${db.databaseName}`);
    /* do whatever operations here to DB, then finally close: */
    client.close();
}).catch(err => {
    console.error(err);
});


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
    // res.send(err);
    console.error(err.status);
});

module.exports = app;