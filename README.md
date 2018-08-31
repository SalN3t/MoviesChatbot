# Uwm Movie Recommandation

This chatbot uses Facebook messenger to communicate with the user. It starts a conversation with the user to understand what the user want then suggest a movie for the user to watch
## Setup

##### Facebook setup
Twillio docs covers this step well enough [HERE](https://www.twilio.com/docs/notify/quickstart/facebook)


##### general setup

  - First create an account into `themoviedb.org` to get the API key and replace in `index.js` With the API key you get.
  
```
 var apiKey = '{TMDB_API_KEY}'; //TMDB api key
```
        


- When you get the messenger access token and the other informations from facebook edit `config/default.json` and update those informations

```
"accessToken": "{FROM_FACEBOOK}",
"accessToken": "{FROM_FACEBOOK}",
"verifyToken": "{FROM_FACEBOOK}",
"appSecret": "",
"botPort": 8007, // Port to open for the bot to communicate, make sure it's locally open by the firewall
"botTunnelSubDomain": "bootbotmoviebotjcysdewx"
```

- Then type to install all the required packages

```
npm install
```
- After that your ready to start the bot by typing
```
bootbot start
```
## Video

[![Stock Market Prediction][vid1]](https://www.youtube.com/watch?v=wl_2WNKPaZE)

[vid1]: https://img.youtube.com/vi/wl_2WNKPaZE/0.jpg
"Stock Market Prediction"

