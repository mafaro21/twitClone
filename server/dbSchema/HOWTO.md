## What are these Files?
These are **Data Models** as well as **Validation rules** that you can *optionally* set up for each ``Collection`` in your MongoDb Database. They enforce data structure and integrity at **Database Level** during inserting and updating, *independent of the application* used to interact with the database. They are called JSON Schema. Learn more about them here: [https://docs.mongodb.com/manual/core/schema-validation/]

## How to use them.
Please note, these files ARE NOT MEANT TO BE INCLUDED OR USED IN YOUR SOURCE CODE. THEY ARE SPECIFICALLY MEANT FOR MONGODb ONLY (the database-side alone).

- First, download the free [MongoDB Compass](https://www.mongodb.com/products/compass) (available for Mac, Linux and Windows).
- Install it and then connect to your existing **database** (or create New one). Then follow these steps:

1. Create a **collection**. Lets start with `users`, for example.
2. Open `db.users.txt` file contained here, **SelectAll** and **Copy** (the *content*, NOT THE FILE itself!!!).
3. Now go back to MongoDB Compass > `yourDatabaseName` > `users` Collection > click **Validation** tab.
4. Make sure **Validation Action** == ERROR, and **Validation Level** == STRICT. Paste the content there and click **Save** at the bottom. DONE.

- Repeat steps 2-4 above for each new `collection` you create, with its corresponding `.txt` file.
- You can always **Update** the rules using MongoDB Compass (or CLI) whenever or however you wish.
