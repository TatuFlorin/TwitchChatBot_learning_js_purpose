## How to use this application

For starting the server, you must to be in the server directory and execute the following command:

### `nodemon start`

After the server is running, you can access the following page:

[http://localhost:5000/auth/twitch?scope=chat:edit+chat:read+channel:moderate+user:edit+user:read:broadcast](http://localhost:5000/auth/twitch?scope=chat:edit+chat:read)

If you wish, you can modify scopes list with others [here](https://dev.twitch.tv/docs/authentication/#scopes).
Be sure you will provide scopes for New Twitch API, and you need to add plus after each added scope.

The link above will provide you the following data:

### access_token

### refresh_token

### token_type

With this data you can call [New Twitch API](https://dev.twitch.tv/docs/api).

### Later will be added new features.

### Good luck and have fun!
