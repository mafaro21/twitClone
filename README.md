# twitClone
A Node.js clone of Twitter, built using MERN stack + Bootstrap. Uses _native_ MongoDB driver 
(NO Mongoose).

## [Live Demo](https://twitclone.netlify.app/)
Local default Settings:

- _Server_:  runs on `http://localhost:5000`
- _Client_:  runs on `http://localhost:3000`

## Features
- Uses React Hooks.
- Redis for Sessions AND Caching.
- MongoDB for the main database. (100% using native node.js driver)
- Schema Validation done by MongoDB's own [built-in validation feature.](https://docs.mongodb.com/manual/core/schema-validation/) (*Requires MongoDB v3.6+)
- Google Captcha (v3) on Login and Register (native code, no 3rd-party libraries )
- Rate-Limiting for auth routes.
- Top News Headlines, updated regularly.
- IMPORTANT: MAKE SURE YOU READ THE FILE: [`server/dbSchema/HOWTO.md`](https://github.com/mafaro21/twitClone/blob/master/server/dbSchema/)
- For more features, see file [`TODO/Twitterclone.md`](https://github.com/mafaro21/twitClone/blob/master/TODO/TwitterClone.md)

