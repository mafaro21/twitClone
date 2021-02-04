TWIT CLONE: 
last update: 2021-02-04
--

App Name:... twitClone?

## TO-DO LIST:


- [x] Design the login and register pages
- [x] Design database model
- [x] Make the frontend.  (_continuous_)
- [x] Connect frontend with backend
- [x] Validating user input in register 
- [ ] Registering users to database
- [ ] Logging in users.
- add User auth: username[30] :no spaces, email, password.
- Add Google Captcha in Register (free).
- Add Chat (DM) feature
- dont store chat msgs in DB for more than X? hours. Clear them Auto. {#to save db space}**
- Add dark mode to each page.
- Add Sound to new message
- Or popup notifications when new message arrives (chat)
- also send notifications when User get a follow / liked tweet.
- record / display/ update #Likes on a tweet
-chat template -> https://socketio-chat-template.templates.repl.co/

## HASHTAGS ## (tough^)
- Add auto hashtags feature. (Maybe we can limit hashtags to 5 MAX per tweet - auto) (live as typing)
- record the hashtags on the tweet in the DB (in an array). [ ]
- enable search by clicking on the hashtag , check the DB’s***{OmG!!!}


## TAGGING ##

- Enable tagging by adding an @before a name when tweeting:: (DAMN:: we may need a faster DB engine to quickly search + display suggestions results as you type)
- If @tagged name not exists, it should NOT auto- generate link. Just appears as plain text
- ELSE, if exists, allow getting the person profile by clicking the @tagged name.
- (maybe later) allow PROFILE preview by hovering mouse on @tagged name!! (Faster DB needed)
