require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 5000;
const helmet = require("helmet");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;
const session = require("express-session");
const isLoggedin = require("./middleware/authchecker");
const redis = require("redis");
const morgan = require("morgan");
const RedisStore = require("connect-redis")(session);

const app = express();

/** CONNECT to REDIS */
const redisClient = redis.createClient({
    host: process.env.REDIS_URI,
    port: process.env.REDIS_PORT || 14847,
    password: process.env.REDIS_PASSWORD,
});

(async () =>
    redisClient.ping((err, reply) => {
        if (err) throw new Error(err);
        console.log(reply);
    })
)();


/** SETUP THE SESSION. */ 
//save to Redis. 03 HOURS ONLY.
app.use(session({
    name: process.env.COOKIE_NAME,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    store: new RedisStore({ client: redisClient }),
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 3, // 3 hour session.
        httpOnly: true,
        secure: app.get("env") === "production" ? true : false,
    },
}));

app.use(morgan("dev"));


/** IMPORT ALL ROUTERS */
const indexRouter = require("./routes/index");
const toRegister = require("./routes/register");
const toLogin = require("./routes/login");
const toFollows = require("./routes/follows");
const toProfile = require("./routes/profile");
const tweetRouter = require("./routes/tweets");
const likesRouter = require("./routes/likes");
const toRetweets = require("./routes/retweets");
const toComments = require('./routes/comments');
const toLogout = require("./routes/logout");
const toExtras = require("./routes/extras");
const statuslogin = require("./routes/statusLogin");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

/** SERVE PAGES ACCORDINGLY */
app.use("/", indexRouter);
app.use("/register", toRegister);
app.use("/login", toLogin);
app.use("/profile", toProfile);
app.use("/tweets", tweetRouter);
app.use("/likes", isLoggedin, likesRouter);
app.use("/follows", isLoggedin, toFollows);
app.use("/retweets", isLoggedin, toRetweets);
app.use("/comments", toComments);
app.use("/logout", toLogout);
app.use("/extras", toExtras);
app.use("/statuslogin", statuslogin);


/** LISTENING PORT */
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

// TEST MongoDB connection
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
    //^if cannot connect, KILL THE SERVER!
});

// if visiting non-existing page, serve error 404
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
    //pass this to error handler below
});

/** REDIS Error handler */
redisClient.on("error", (error) => {
    if (error.code === "ECONNRESET") console.error(error.message);
    else throw error;
});


/** main error handler */
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
