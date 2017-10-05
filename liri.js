var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var input = process.argv[2];

var titleInput = "";

for (var i = 3; i < process.argv.length; i++){
  if (i > 3 && i < process.argv.length){
    titleInput = titleInput + "+" + process.argv[i];
  } else {
    titleInput = titleInput + process.argv[i];
  }
}

if (input == "my-tweets") {
	showTweets();
} else if (input == "spotify-this-song"){
	if (titleInput != "") {
		spotifySong(titleInput);
	} else {
		spotifySong("The+Sign");
	}
} else if (input == "movie-this"){
	if (titleInput != "") {
		findMovie(titleInput);
	} else {
		findMovie("Mr.+Nobody");
	}
} else if (input == "do-what-it-says") {
	doIt();
} else {
	console.log("Not an accepted command");
}

function showTweets () {
	var client = new Twitter(keys.twitterKeys);

  var params = {screen_name: "trevornelson86", count: 20};
  client.get('statuses/user_timeline', params, function(err, tweets, response){
    if (!err) {
      for (var i = 0; i < tweets.length; i++) {
        var date = tweets[i].created_at;
        console.log("Most Recent Tweet (Tweet " + (i+1) + ") from @trevornelson86: " + "\n" + tweets[i].text + " - Tweeted At: " + date.substring(0, 19) + "\n");
      }
    } else {
      console.log('ERROR');
      console.log(err);
    }
  });
}

function spotifySong (song) {
	var spotify = new Spotify(keys.spotifyKeys);
	spotify.search({ type: "track", query: song}, function(err, data){
    if (!err) {
      for (var i = 0; i < data.tracks.items.length; i++) {
        var spotifyData = data.tracks.items[i];
        console.log("Artist: " + spotifyData.artists[0].name);
        console.log("Song: " + spotifyData.name);
        console.log("Preview URL: " + spotifyData.preview_url);
        console.log("Album: " + spotifyData.album.name);
        console.log("\n");
      }
    } else {
      console.log('ERROR');
      console.log(err);
    }
  });
}

function findMovie (movieTitle) {
	var omdbURL = ("http://www.omdbapi.com/?apikey=40e9cece&t=" + movieTitle);
	request(omdbURL, function (err, response, body){
		if (!err) {
			var omdbResponse = JSON.parse(body);
		  console.log("Title: " + omdbResponse.Title);
		  console.log("Year: " + omdbResponse.Year);
		  console.log("IBDM Rating: " + omdbResponse.imdbRating);
		  console.log("Rotten Tomatoes Rating: " + omdbResponse.Ratings[2].Value);
		  console.log("Country: " + omdbResponse.Country);
		  console.log("Language: " + omdbResponse.Language);
		  console.log("Plot: " + omdbResponse.Plot);
		  console.log("Actors: " + omdbResponse.Actors);
		} else {
      console.log('ERROR');
      console.log(err);
		}
	});
}

function doIt () {
	fs.readFile("random.txt", "utf8", function(err, data){
		var random = data.split(",");
		switch (random[0]){
			case "my-tweets":
				showTweets();
				break;
			case "spotify-this-song":
				spotifySong(random[1]);
				break;
			case "movie-this":
				findMovie(random[1]);
				break;
			default: console.log("Not an accepted command");
		}
	});
}

