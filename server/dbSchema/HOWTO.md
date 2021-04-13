## IMPORTANT ⚠:
Please note, these files ARE NOT MEANT TO BE INCLUDED OR USED DIRECTLY IN YOUR APP SOURCE CODE (LIKE Mongoose Schema). THEY ARE SPECIFICALLY MEANT for MongoDB Compass (read more below). They can also be used as _reference_ during your app development. Also, They are NOT an excuse to skip doing _data validation_ on both Server AND Client side. They simply add an EXTRA RIGID layer of security at DATABASE level.

## What are these Files?
ANY SINGLE one of the files define 2 things:  **Data Schema** as well as **Validation Rules** for each corresponding ``Collection`` in your MongoDb Database. They enforce data structure & integrity at **DATABASE LEVEL** during inserting and updating, *independent of the application* used (i.e, they can work with JAVA, PHP, Node, C# applications, etc.). To learn more, see [official MongoDB docs:](https://docs.mongodb.com/manual/core/schema-validation/).

## How to use them.
- First, download the free [MongoDB Compass](https://www.mongodb.com/products/compass) (available for Mac, Linux and Windows). It's a GUI app for MongoDB.
- Install it and then connect to your existing **database** (or create New one). Then follow these steps:

1. Create a **collection**. Lets start with `users`, for example.
2. Open `twitclone.users.json` file contained here, **SelectAll** and **Copy** (the *content*, NOT THE FILE itself!!!).
3. Now go back to MongoDB Compass > `yourDatabaseName` > `users` Collection > click **Validation** tab.
4. Make sure **Validation Action** == _ERROR_, and **Validation Level** == _STRICT_. Paste the content there and click **Save** at the bottom. DONE.

- Repeat steps 2-4 above for each new `collection` you create, with its corresponding `.json` file.
- You can always **Update** the rules using MongoDB Compass (or CLI) whenever you wish.
