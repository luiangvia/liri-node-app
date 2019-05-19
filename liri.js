require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var moment = require('moment');
var axios = require("axios");
var fs = require("fs")


var spotify = new Spotify(keys.spotify);


var findArtistNames = function (artist) {
    return artist.name;
};

var findMeSpotify = function (songName) {
    if (songName === undefined) {
        songName = "What's my age again";
    }

    spotify.search({
            type: "track",
            query: songName
        },
        function (err, data) {
            if (err) {
                console.log("Error: " + err);
                return;
            }

            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("Artist(s): " + songs[i].artists.map(findArtistNames));
                console.log("Song Name: " + songs[i].name);
                console.log("Preview Song: " + songs[i].preview_url);
                console.log("Album: " + songs[i].album.name);
                console.log("-----------------------------------");
            }
        }
    );
};

var findMyBands = function (artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(
        function (response) {
            var result = response.data;

            if (!result.length) {
                console.log("No results found for " + artist);
                return;
            }

            console.log("Upcoming concerts for " + artist + ":");

            for (var i = 0; i < result.length; i++) {
                var show = result[i];

                console.log(
                    show.venue.city +
                    "," +
                    (show.venue.region || show.venue.country) +
                    " at " +
                    show.venue.name +
                    " " +
                    moment(show.datetime).format("MM/DD/YYYY")
                );
            }
        }
    );
};


var findMeMovie = function (movieName) {
    if (movieName === undefined) {
        movieName = "Mr Nobody";
    }

    var url =
        "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

    axios.get(url).then(
        function (response) {
            var result = response.data;
            console.log("Title :" + result.Title);
            console.log("Year :" + result.Released);
            console.log("IMDB Rating :" + result.imdbRating);
            console.log("Rotten Tomatoes :" + result.Ratings[1].Value);
            console.log("Country :" + result.Country);
            console.log("Language :" + result.Language);
            console.log("Movie Plot :" + result.Plot);
            console.log("Actors :" + result.Actors);
        }
    );
};
var doWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {
        console.log(data);

        var dataArr = data.split(",");

        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    });
};
var pick = function (caseInfo, functionResult) {
    switch (caseInfo) {
        case "concert-this":
            findMyBands(functionResult);
            break;
        case "spotify-this-song":
            findMeSpotify(functionResult);
            break;
        case "movie-this":
            findMeMovie(functionResult);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("LIRI has no idea what you are trying to do!!!!!");
    }
};
var runThis = function (argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv.slice(3).join(" "));