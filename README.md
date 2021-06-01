# twitClone
A Node.js clone of Twitter, built using MERN stack + Bootstrap. Uses _native_ MongoDB driver 
(NO Mongoose).

- _Server_:  runs on `http://localhost:5000`
- _Client_:  runs on `http://localhost:3000`

## Features
- Redis for Sessions store.
- Uses React Hooks (Functional Components)
- MongoDB for the main database. (100% using native node.js driver)
- Schema Validation done by MongoDB's own [built-in validation feature.](https://docs.mongodb.com/manual/core/schema-validation/) (*Requires MongoDB v3.6+. Also see: `./server/dbSchema/HOWTO.md`)
- Google Captcha (v3) on Login and Register (native code, no 3rd-party libraries )
- Rate-Limiting for auth routes.
- Top News Headlines, updated regularly.
- (...List more _unique_ features of our app here...)

