require("dotenv").config();

var request = require('request');
var fs = require('fs');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
moment().format();

var axios = require('axios');
var userSay = process.argv[2];
var parameter = process.argv[3];

AskLiri(userSay, parameter);

function AskLiri(userSay, parameter) {
    switch (userSay) {
        case 'concert-this':
            bandsInTown(parameter);
            break;

        case 'spotify-this-song':
            spotifySong(parameter);
            break;

        case 'movie-this':
            ombdMovie(parameter);
            break;

        case 'do-what-it-says':
            randomLiri();
            break;
    }
};

// Function: concert-this
// node liri.js concert-this <artist/band name here>
function bandsInTown(parameter) {
    axios.get("https://rest.bandsintown.com/artists/" + parameter + "/events?app_id=codingbootcamp")
        .then(function (concert) {
            for (i = 0; i < concert.data.length; i++) {
                console.log("Concert Info - " + [i + 1]);
                fs.appendFileSync("log.txt", "Concert Info - " + [i + 1] + "\n");

                // Name of the venue
                console.log("Name of the Venue: " + concert.data[i].venue.name);
                fs.appendFileSync("log.txt", "Name of the Venue: " + concert.data[i].venue.name + "\n");

                // Venue location
                console.log("Venue Location: " + concert.data[i].venue.city + ", " + concert.data[i].venue.country);
                fs.appendFileSync("log.txt", "Venue Location: " + concert.data[i].venue.city + ", " + concert.data[i].venue.country + "\n");

                // Date of the Event (use moment to format this as "MM/DD/YYYY")
                var dateArr = moment(concert.data[i].datetime).format('MM/DD/YYYY, hh:mmA').split(",");
                var concertDate = dateArr[0] + dateArr[1];
                console.log("Date of the Event: " + concertDate)
                fs.appendFileSync("log.txt", "Date of the Event: " + concertDate + "\n");

                console.log("-----------------------------------------------------------")
                fs.appendFileSync("log.txt", "-----------------------------------------------------");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    // var queryUrl = "https://rest.bandsintown.com/artists/" + parameter + "/events?app_id=codingbootcamp";
    // request(queryUrl, function (error, response, body) {
    //     if (!error && response.statusCode === 200) {
    //         const concert = JSON.parse(body);
    //         for (i = 0; i < concert.length; i++) {
    //             console.log("\nConcert Info - " + [i + 1]);
    //             fs.appendFileSync("log.txt", "Concert Info - " + [i + 1] + "\n");

    //             // Name of the venue
    //             console.log("Name of the Venue: " + concert[i].venue.name);
    //             fs.appendFileSync("log.txt", "Name of the Venue: " + concert[i].venue.name + "\n");

    //             // Venue location
    //             console.log("Venue Location: " + concert[i].venue.city + ", " + concert[i].venue.country);
    //             fs.appendFileSync("log.txt", "Venue Location: " + concert[i].venue.city + ", " + concert[i].venue.country + "\n");

    //             // Date of the Event (use moment to format this as "MM/DD/YYYY")
    //             var dateArr = moment(concert[i].datetime).format('MM/DD/YYYY, hh:mmA').split(",");
    //             var concertDate = dateArr[0] + dateArr[1];
    //             console.log("Date of the Event: " + concertDate)
    //             fs.appendFileSync("log.txt", "Date of the Event: " + concertDate + "\n");
    //         }
    //     }
    // });
}

// Function: spotify-this-song
// node liri.js spotify-this-song '<song name here>'
function spotifySong(parameter) {
    // If no song is provided then your program will default to "The Sign" by Ace of Base.
    if (parameter === undefined || null) {
        parameter = "The Sign";
    };

    spotify.search({
        type: 'track',
        query: parameter
    }, function (error, data) {
        if (error) {
            console.log('Error occurred: ' + error);
            return;
        };
        var song = data.tracks.items;
        for (var i = 0; i < song.length; i++) {
            console.log("Song Info - " + [i + 1]);
            fs.appendFileSync("log.txt", "Song Info - " + [i + 1] + "\n");

            // Artist(s)
            console.log("Artist(s): " + song[i].artists[0].name);
            fs.appendFileSync("log.txt", "artist(s): " + song[i].artists[0].name + "\n");

            // The song's name
            console.log("Song name: " + song[i].name);
            fs.appendFileSync("log.txt", "song name: " + song[i].name + "\n");

            // A preview link of the song from Spotify
            console.log("Preview song: " + song[i].preview_url);
            fs.appendFileSync("log.txt", "preview song: " + song[i].preview_url + "\n");

            // The album that the song is from
            console.log("Album: " + song[i].album.name);
            fs.appendFileSync("log.txt", "album: " + song[i].album.name + "\n");

            console.log("-----------------------------------------------------------")
            fs.appendFileSync("log.txt", "-----------------------------------------------------");
        }
    });
};

// Function: movie-this
// node liri.js movie-this '<movie name here>'
function ombdMovie(parameter) {
    // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    if (parameter === undefined || null) {
        parameter = "Mr. Nobody";
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        fs.appendFileSync("log.txt", "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" + "\n");
        console.log("It's on Netflix!");
        fs.appendFileSync("log.txt", "It's on Netflix!\n");
    };

    axios.get("https://www.omdbapi.com/?t=" + parameter + "&y=&plot=short&apikey=trilogy")
        .then(function (movie) {
            var movieInfo =
                "--------------------------------------------------------------------" +
                "\nMovie Title: " + movie.data.Title +
                "\nYear of Release: " + movie.data.Year +
                "\nIMDB Rating: " + movie.data.imdbRating +
                "\nRotten Tomatoes Rating: " + movie.data.Ratings[1].Value +
                "\nCountry Produced: " + movie.data.Country +
                "\nLanguage: " + movie.data.Language +
                "\nPlot: " + movie.data.Plot +
                "\nActors/Actresses: " + movie.data.Actors;
            console.log(movieInfo);
        })
        .catch(function (error) {
            console.log(error);
        });

    // var queryUrl = "http://www.omdbapi.com/?t=" + parameter + "&y=&plot=short&apikey=trilogy";

    // request(queryUrl, function (error, response, body) {
    //     var movie = JSON.parse(body);
    //     if (!error && response.statusCode === 200) {
    //         // Title of the movie.
    //         console.log("Title: " + movie.Title);
    //         fs.appendFileSync("log.txt", "Title: " + movie.Title + "\n");

    //         // Year the movie came out.
    //         console.log("Release Year: " + movie.Year);
    //         fs.appendFileSync("log.txt", "Release Year: " + movie.Year + "\n");

    //         // IMDB Rating of the movie.
    //         console.log("IMDB Rating: " + movie.imdbRating);
    //         fs.appendFileSync("log.txt", "IMDB Rating: " + movie.imdbRating + "\n");

    //         // Rotten Tomatoes Rating of the movie.
    //         console.log("Rotten Tomatoes Rating: " + movie.Rating[1].Value);
    //         fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + movie.Rating[1].Value + "\n");

    //         // Country where the movie was produced.
    //         console.log("Country of Production: " + movie.Country);
    //         fs.appendFileSync("log.txt", "Country of Production: " + movie.Country + "\n");

    //         // Language of the movie.
    //         console.log("Language: " + movie.Language);
    //         fs.appendFileSync("log.txt", "Language: " + movie.Language + "\n");

    //         // Plot of the movie.
    //         console.log("Plot: " + movie.Plot);
    //         fs.appendFileSync("log.txt", "Plot: " + movie.Plot + "\n");

    //         // Actors in the movie.
    //         console.log("Actors: " + movie.Actors);
    //         fs.appendFileSync("log.txt", "Actors: " + movie.Actors + "\n");

    //         console.log("----------------------------------------");
    //         fs.appendFileSync("log.txt", "-----------------------------------");

    //     }
    // });
};


// Function: do-what-it-says
// node liri.js do-what-it-says
function randomLiri(){
	fs.readFile('random.txt', 'utf8', function(err, data){
        
        if (err){ 
			return console.log(err);
		}
        var dataArr = data.split(',');
        AskLiri(dataArr[0], dataArr[1]);
	});
}

AskLiri();