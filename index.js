'use strict';
const BootBot = require('bootbot');
const config = require('config');
const fetch = require('node-fetch');
var apiKey = 'KEY_HERE'; //TMDB api key
var movieRecommendation = 'https://api.themoviedb.org/3/discover/movie?api_key=' + apiKey + '&language=en-US'; //API request to get the recommendation

//New bot with the facebook app details
const bot = new BootBot({
    accessToken: config.get('accessToken'),
    verifyToken: config.get('verifyToken'),
    appSecret: config.get('appSecret')
});

// List of the supported Genres
var items = ['comedy', 'action', 'adventure', 'animation', 'crime', 'documentary', 'drama', 'family',
    'fantasy', 'history', 'horror', 'music', 'mystery', 'romance', 'science fiction', 'tv movie',
    'thriller', 'war', 'western'
];


/**
 * This function is to handle when the user is asking for Genre
 * @param {*} convo The conversation object
 */
const askGenre = (convo) => {
    const question = {
        text: `Which genre do you want to watch, you can pick or type another ones.\nType "list" to see the genre list I support.\nIf you want to end this conversation type "end"`,
        quickReplies: ['comedy', 'action', 'adventure']
    };
    const answer = (payload, convo, data) => {
        const text = payload.message.text;
        if (text == 'list') {
            convo.say(`The genres supported are: ${items.toString()}`).then(() => askGenre(convo));
        } else if (text == 'end') {
            convo.end();
        } else {
            convo.set('genre_item', text);
            convo.say(`Great! your genre choice ${text}`).then(() => askDate(convo));
        }
    };
    convo.ask(question, answer);
};

/**
 * This function continue the conversation and asks the user for the release date
 * @param {*} convo The conversation object
 */
const askDate = (convo) => {
    convo.ask(`What is the release date in mind if any or type none`, (payload, convo, data) => {
        const text = payload.message.text;
        convo.set('date_item', text);
        convo.say(`Got it, release date ${text}`).then(() => asTopOrRandom(convo));
    });
};

/**
 * This function continue the conversation and asks the user if the want to search for top rated or random movies
 * @param {*} convo The conversation object
 */
const asTopOrRandom = (convo) => {
    const question = {
        text: `Choose if either you want me to find a random or one of the top rated onces`,
        quickReplies: ['Random', 'Top Rated']
    };
    convo.ask(question, (payload, convo, data) => {
        const text = payload.message.text;
        convo.set('rated_item', text);
        convo.say(`You want to search ${text}`).then(() => {

            let id;
            let res = String(convo.get('genre_item')).toLowerCase();
            //switch statement to match the genre stated to the genre ID
            switch (res) {
                case "comedy":
                    id = 35;
                    break;
                case "action":
                    id = 28;
                    break;
                case "adventure":
                    id = 12;
                    break;
                case "animation":
                    id = 16;
                    break;
                case "crime":
                    id = 80;
                    break;
                case "documentary":
                    id = 99;
                    break;
                case "drama":
                    id = 18;
                    break;
                case "family":
                    id = 10751;
                    break;
                case "fantasy":
                    id = 14;
                    break;
                case "history":
                    id = 36;
                    break;
                case "horror":
                    id = 27;
                    break;
                case "music":
                    id = 10402;
                    break;
                case "mystery":
                    id = 9648;
                    break;
                case "romance":
                    id = 10749;
                    break;
                case "science fiction":
                    id = 878;
                    break;
                case "tv movie":
                    id = 10770;
                    break;
                case "thriller":
                    id = 53;
                    break;
                case "war":
                    id = 10752;
                    break;
                case "western":
                    id = 37;
                    break;
                default:
                    convo.say('That is not a genre.');
            }
            //Conditional to check if the genre matched any existing genre ID
            if (id != undefined) {
                movieRecommendation = movieRecommendation + '&with_genres=' + id;
            }
            if (!isNaN(convo.get('date_item'))) {
                movieRecommendation = movieRecommendation + '&primary_release_year=' + convo.get('date_item');
            }

            let ran_str = String(convo.get('rated_item')).toLowerCase();

            if (ran_str == 'top rated') {
                movieRecommendation = movieRecommendation + '&sort_by=vote_average.desc';
            }
            console.log(movieRecommendation);
            //make the API request and store the response.
            fetch(movieRecommendation)
                .then(res => res.json())
                .then(json => {
                    //sends the movie title, overview and image in a facebook messenger generic template
                    convo.sendGenericTemplate([{
                        title: json.results[0].original_title,
                        subtitle: json.results[0].overview,
                        image_url: 'http://image.tmdb.org/t/p/w500' + json.results[0].poster_path
                    }]).then(() => {
                        const continueAsking = {
                            text: `Would you like another suggestion?`,
                            quickReplies: ['Yes', 'No']
                        };

                        convo.ask(continueAsking, (payload, convo, data) => {
                            const text = payload.message.text;
                            if (text.toLowerCase() == 'yes') {
                                convo.set('date_item', text);
                                convo.say(`OK, searching for another recommendations`).then(() => keepSearching(convo));
                            } else {
                                convo.end();
                            }
                        });
                    });
                });
            convo.say('searching for recommendations... '); //declares that the bot is searching for the recommendation
            console.log(id);
        });
    });
};

const keepSearching = (convo) => {
    var movieRecommendation = 'https://api.themoviedb.org/3/discover/movie?api_key=' + apiKey + '&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres='; //API request to get the recommendation

    var items = ['comedy', 'action', 'adventure', 'animation', 'crime', 'documentary', 'drama', 'family',
        'fantasy', 'history', 'horror', 'music', 'mystery', 'romance', 'science fiction', 'tv movie',
        'thriller', 'war', 'western'
    ];
    let res = items[Math.floor(Math.random() * items.length)];
    console.log(res);
    let id;

    //switch statement to match the genre stated to the genre ID
    switch (res) {
        case "comedy":
            id = 35;
            break;
        case "action":
            id = 28;
            break;
        case "adventure":
            id = 12;
            break;
        case "animation":
            id = 16;
            break;
        case "crime":
            id = 80;
            break;
        case "documentary":
            id = 99;
            break;
        case "drama":
            id = 18;
            break;
        case "family":
            id = 10751;
            break;
        case "fantasy":
            id = 14;
            break;
        case "history":
            id = 36;
            break;
        case "horror":
            id = 27;
            break;
        case "music":
            id = 10402;
            break;
        case "mystery":
            id = 9648;
            break;
        case "romance":
            id = 10749;
            break;
        case "science fiction":
            id = 878;
            break;
        case "tv movie":
            id = 10770;
            break;
        case "thriller":
            id = 53;
            break;
        case "war":
            id = 10752;
            break;
        case "western":
            id = 37;
            break;
        default:
            convo.say('That is not a genre.');
    }

    //Conditional to check if the genre matched any existing genre ID
    if (id != undefined) {
        //make the API request and store the response.
        fetch(movieRecommendation + id)
            .then(res => res.json())
            .then(json => {
                //sends the movie title, overview and image in a facebook messenger generic template
                convo.sendGenericTemplate([{
                    title: json.results[0].original_title,
                    subtitle: json.results[0].overview,
                    image_url: 'http://image.tmdb.org/t/p/w500' + json.results[0].poster_path
                }]).then(() => {
                    const continueAsking = {
                        text: `Would you like another suggestion?`,
                        quickReplies: ['Yes', 'No']
                    };

                    convo.ask(continueAsking, (payload, convo, data) => {
                        const text = payload.message.text;
                        if (text.toLowerCase() == 'yes') {
                            convo.set('date_item', text);
                            convo.say(`OK, searching for another recommendations`).then(() => keepSearching(convo));
                        } else {
                            convo.end();
                        }
                    });
                });
            });
        convo.say('searching for recommendations... '); //declares that the bot is searching for the recommendation
        console.log(id);
    }
};

// --------------------------------------
//       Intents Capturing
//--------------------------------------

/**
 * This is a listener for any matched key words
 * It will have the response as the payload and also return the chat object
 * where it will be used to start the conversation with the user
 * Intents targeting: {#general_search}
 * 
 */
bot.hear([/genre (.*)/i, /any(.*)/i], (payload, chat, data) => {
    var movieRecommendation = 'https://api.themoviedb.org/3/discover/movie?api_key=' + apiKey + '&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres='; //API request to get the recommendation

    //Stringify the users response
    const query = String(data.match[1]);
    //convert the response to lowercase to prevent request errors
    let res;
    const first_word = String(data.match[1]).toLowerCase();
    if (first_word == 'genre') {
        res = query.toLowerCase();
    } else {
        res = items[Math.floor(Math.random() * items.length)];

    }

    let id;
    //switch statement to match the genre stated to the genre ID
    switch (res) {
        case "comedy":

            id = 35;
            break;
        case "action":
            id = 28;
            break;
        case "adventure":
            id = 12;
            break;
        case "animation":
            id = 16;
            break;
        case "crime":
            id = 80;
            break;
        case "documentary":
            id = 99;
            break;
        case "drama":
            id = 18;
            break;
        case "family":
            id = 10751;
            break;
        case "fantasy":
            id = 14;
            break;
        case "history":
            id = 36;
            break;
        case "horror":
            id = 27;
            break;
        case "music":
            id = 10402;
            break;
        case "mystery":
            id = 9648;
            break;
        case "romance":
            id = 10749;
            break;
        case "science fiction":
            id = 878;
            break;
        case "tv movie":
            id = 10770;
            break;
        case "thriller":
            id = 53;
            break;
        case "war":
            id = 10752;
            break;
        case "western":
            id = 37;
            break;
        default:
            chat.say('That is not a genre.');
    }

    //Conditional to check if the genre matched any existing genre ID
    if (id != undefined) {

        //make the API request and store the response.
        fetch(movieRecommendation + id)
            .then(res => res.json())
            .then(json => {
                //sends the movie title, overview and image in a facebook messenger generic template
                chat.sendGenericTemplate([{
                    title: json.results[0].original_title,
                    subtitle: json.results[0].overview,
                    image_url: 'http://image.tmdb.org/t/p/w500' + json.results[0].poster_path
                }]);

            });

        chat.say('searching for recommendations... '); //declares that the bot is searching for the recommendation
        console.log(id);

    }

});

/**
 * This is a listener for any matched key words
 * It will have the response as the payload and also return the chat object
 * where it will be used to start the conversation with the user
 * Intents targeting: {#conversation}
 */
bot.hear(['hello', 'hey', 'hi'], (payload, chat) => {
    chat.conversation((convo) => {
        convo.sendTypingIndicator(1000).then(() => askGenre(convo));
    });
});


/**
 * This is a listener for any matched key words
 * It will have the response as the payload and also return the chat object
 * where it will be used to start the conversation with the user
 * Intents targeting: {#conversation}
 * 
 */
bot.hear(/suggest(.*)/i, (payload, chat) => {
    chat.conversation((convo) => {
        convo.sendTypingIndicator(1000).then(() => askGenre(convo));
    });
});



/**
 * This is a listener for any matched key words
 * It will have the response as the payload and also return the chat object
 * where it will be used to start the conversation with the user
 * Intents targeting: {#help}
 * 
 */
bot.hear('help', (payload, chat) => {
    chat.say('Hello friend', { typing: true }).then(() => (
        chat.say('Hey there! You can ask my for any recommandation either type "suggest me a movie" or for example "genre action"', { typing: true })
    ));
});

//Start the bot server
bot.start(config.get('botPort'));