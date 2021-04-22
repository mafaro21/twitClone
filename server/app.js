require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 5000;
const helmet = require("helmet");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;
const session = require("express-session");
const isLoggedin = require("./middleware/authchecker");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();

//initialize session store.
const sessionStore = new MongoDBStore({
    uri: uri,
    databaseName: "twitclone",
    collection: "sessions",
    connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
}, (error) => {
    if (error) throw error;
});

//setup the session. 02 HOURS ONLY.
app.use(session({
    name: process.env.COOKIE_NAME,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    store: sessionStore,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2, // 2 hour session.
        httpOnly: true,
        secure: app.get("env") === "production" ? true : false,
    },
}));


//import all routers
const indexRouter = require("./routes/index");
const toRegister = require("./routes/register");
const toLogin = require("./routes/login");
const toFollows = require("./routes/follows");
const toProfile = require("./routes/profile");
const tweetRouter = require("./routes/tweets");
const likesRouter = require("./routes/likes");
const toLogout = require("./routes/logout");
const statuslogin = require("./routes/statusLogin");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

//Serve pages accordingly
app.use("/", indexRouter);
app.use("/register", toRegister);
app.use("/login", toLogin);
app.use("/profile", toProfile);
app.use("/tweets", tweetRouter);
app.use("/likes", isLoggedin, likesRouter);
app.use("/follows", isLoggedin, toFollows);
app.use("/logout", toLogout);
app.use("/statuslogin", statuslogin);

//listening port
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

//connect to Mongodb
MongoClient.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then((client) => {
    const db = client.db("twitclone");
    console.log(`connected to database ${db.databaseName}`);
    client.close();
}).catch((err) => {
    console.error(err);
    process.exit(1);
    //if cannot connect, KILL THE SERVER
});

// if visiting non-existing page, serve error 404
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
    //pass this to error handler below
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err);
    console.error(err.message);
});

module.exports = app;
