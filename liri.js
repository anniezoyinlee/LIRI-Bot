require("dotenv").config();

var request = require('request');
var fs = require('fs');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
moment().format();

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
            movieInfo(parameter);
            break;

        case 'do-what-it-says':
            randomLiri();
            break;
    }
};

// Function: concert-this
// node liri.js concert-this <artist/band name here>
function bandsInTown(parameter) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + parameter + "/events?app_id=codingbootcamp";
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const concert = JSON.parse(body);
            for (i = 0; i < concert.length; i++) {
                console.log("\nConcert Info - " + [i + 1]);
                fs.appendFileSync("log.txt", "Concert Info - " + [i + 1] + "\n");

                // Name of the venue
                console.log("Name of the Venue: " + concert[i].venue.name);
                fs.appendFileSync("log.txt", "Name of the Venue: " + concert[i].venue.name + "\n");

                // Venue location
                console.log("Venue Location: " + concert[i].venue.city + ", " + concert[i].venue.country);
                fs.appendFileSync("log.txt", "Venue Location: " + concert[i].venue.city + ", " + concert[i].venue.country + "\n");

                // Date of the Event (use moment to format this as "MM/DD/YYYY")
                var dateArr = moment(concert[i].datetime).format('MM/DD/YYYY, hh:mmA').split(",");
                var concertDate = dateArr[0] + dateArr[1];
                console.log("Date of the Event: " + concertDate)
                fs.appendFileSync("log.txt", "Date of the Event: " + concertDate + "\n");
            }
        }
    });
}

// Function: spotify-this-song
// node liri.js spotify-this-song '<song name here>'
function spotifySong(parameter) {
    // default song
    if (parameter === undefined || null) {
        parameter = "The Sign";
    }

    spotify.search({
        type: 'track',
        query: parameter
    }, function (error, data) {
        if (error) {
            console.log('Error occurred: ' + error);
            return;
        }
        var song = data.tracks.items;
        for (var i = 0; i < song.length; i++) {
            console.log("\nSong Info - " + [i + 1]);
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
        }
    });
};

// // movie-this
// // node liri.js movie-this '<movie name here>'
// function movieInfo(parameter) {


//     var findMovie;
//     if (parameter === undefined) {
//         findMovie = "Mr. Nobody";
//     } else {
//         findMovie = parameter;
//     };

//     var queryUrl = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";

//     request(queryUrl, function (err, res, body) {
//         var bodyOf = JSON.parse(body);
//         if (!err && res.statusCode === 200) {
//             logIt("\n---------------------------------------------------\n");
//             logIt("Title: " + bodyOf.Title);
//             logIt("Release Year: " + bodyOf.Year);
//             logIt("IMDB Rating: " + bodyOf.imdbRating);
//             logIt("Rotten Tomatoes Rating: " + bodyOf.Ratings[1].Value);
//             logIt("Country: " + bodyOf.Country);
//             logIt("Language: " + bodyOf.Language);
//             logIt("Plot: " + bodyOf.Plot);
//             logIt("Actors: " + bodyOf.Actors);
//             logIt("\n---------------------------------------------------\n");
//         }
//     });
// };

// // do-what-it-says
// // node liri.js do-what-it-says
// function getRandom() {
//     fs.readFile('random.txt', "utf8", function (error, data) {

//         if (error) {
//             return logIt(error);
//         }

//         var dataArr = data.split(",");

//         if (dataArr[0] === "spotify-this-song") {
//             var songcheck = dataArr[1].trim().slice(1, -1);
//             spotSong(songcheck);
//         }
//         else if (dataArr[0] === "concert-this") {
//             if (dataArr[1].charAt(1) === "'") {
//                 var dLength = dataArr[1].length - 1;
//                 var data = dataArr[1].substring(2, dLength);
//                 console.log(data);
//                 bandsInTown(data);
//             }
//             else {
//                 var bandName = dataArr[1].trim();
//                 console.log(bandName);
//                 bandsInTown(bandName);
//             }
//         }
//         else if (dataArr[0] === "movie-this") {
//             var movie_name = dataArr[1].trim().slice(1, -1);
//             movieInfo(movie_name);
//         }
//     });
// };

function logIt(dataToLog) {

    console.log(dataToLog);

    fs.appendFile('log.txt', dataToLog + '\n', function (err) {

        if (err) return logIt('Error logging data to file: ' + err);
    });
}


AskLiri();