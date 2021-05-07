## IMPORTANT ⚠:
Please note, these _json_ files ARE NOT MEANT TO BE INCLUDED OR USED DIRECTLY IN YOUR APP SOURCE CODE (LIKE Mongoose Schema). THEY ARE SPECIFICALLY MEANT for MongoDB Compass (read more below). Also, They are NOT an excuse to skip doing _data validation_ on both Server AND Client side. They simply add an EXTRA RIGID layer of validation at DATABASE level.

## What are these Files?
ANY SINGLE one of the files define 2 things:  **Data Schema** as well as **Validation Rules** for each corresponding ``Collection`` in your MongoDb Database. (Equivalent to Mongoose Schema). They enforce data structure & integrity at **DATABASE LEVEL** during inserting and updating, *independent of the application* used (i.e, they can work with JAVA, PHP, Node, C# applications, etc.). To learn more, see [official MongoDB docs:](https://docs.mongodb.com/manual/core/schema-validation/).

## How to use them.
- First, download the free [MongoDB Compass](https://www.mongodb.com/products/compass) (available for Mac, Linux and Windows). It's the official GUI desktop app for MongoDB.
- Install it and then connect to your existing **database** (or create New one). Then follow these steps:

1. Create a **collection**. Lets start with `users`, for example.
2. Open `twitclone.users.json` file contained here with any text-editor, **SelectAll** and **Copy** (the *content*, NOT THE FILE itself!!!).
3. Now go back to MongoDB Compass > `yourDatabaseName` > `users` Collection > click **Validation** tab. {_TODO: show image here_}
4. Make sure **Validation Action** == _ERROR_, and **Validation Level** == _STRICT_. Paste the content there and click **Save** at the bottom. DONE! {_TODO: show image here_}

- Repeat steps 2-4 above for each new `collection` you create, with its corresponding `.json` file.
- You can always **Update** the rules using MongoDB Compass (or CLI) whenever you wish.