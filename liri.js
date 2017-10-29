var fs = require("fs");
var keys = require("./keys.js");
var twitter = require("twitter");
var Spotify = require('node-spotify-api');
var request = require("request");
var inquirer = require("inquirer");


inquirer
  .prompt([

  {
    type: "list",
    message: "Please choose an option below",
    choices: ["Show my recent tweets","Spotify a song","Find information about a movie","Do what it says"],
    name: "option"
  }

  ]).then( function(inquirerResponse){

      if(inquirerResponse.option === "Show my recent tweets"){

          showMyTweets();

      }else if(inquirerResponse.option === "Spotify a song"){

        inquirer
          .prompt([
            {
              type: "input",
              message: "Please enter the song name",
              name: "songName",
              default: "The Sign"
            }
          ]).then( function(spotifyResponse){

            spotifyThis(spotifyResponse.songName);                

          }).catch( function(err){
            console.log(err);
          });

      }else if(inquirerResponse.option === "Find information about a movie"){

        inquirer
          .prompt([
            {
              type: "input",
              message: "Please enter the name of the movie",
              name: "movieName",
              default: "Mr. Nobody"
            }

            ]).then( function(response){

              movieThis(response.movieName);

            }).catch( function(err){
              console.log(err);
            });

      }else if(inquirerResponse.option === "Do what it says"){

        fs.readFile("random.txt", "utf8" , function(err, data){
          if(err){
            return console.log(err);
          }

          var dataArr = data.split(",");

          if(dataArr[0] === "spotify-this-song"){

            spotifyThis(dataArr[1]);

          }else if(dataArr[0] === "movie-this"){

            movieThis(dataArr[1]);

          }else if(dataArr[0] === "my-tweets"){

            showMyTweets();

          }

        });
      }

  }).catch( function(err){
      console.log(err.message);
      console.log(err);
  });

function spotifyThis(songName){

  var song = songName;

  var spotify = new Spotify({

        id: '093b64bde3644268b2fc600197c77a9d',
        secret: '9e76f727142044cbb265ab5f924fd58e'

      });
   
  spotify
    .search({ type: 'track', query: song })

    .then(function(response) {

      if(song === "The Sign"){

        let consoleLog = "Album name is: " + response.tracks.items[8].album.name + "\n"
          + "Artist name is: " + response.tracks.items[8].album.artists[0].name + "\n"
          + "Song name is: " + response.tracks.items[8].name + "\n"
          + "Preview url: " + response.tracks.items[8].preview_url + "\n"
          + "----------------------";

        console.log(consoleLog);

        fs.appendFile("log.txt","\nSpotify-this:\n" +  consoleLog, function(err){
          if(err){
            console.log(err);
          }
        });
      }else{

        let consoleLog = "Album name is: " + response.tracks.items[0].album.name + "\n"
          + "Artist name is: " + response.tracks.items[0].album.artists[0].name + "\n"
          + "Song name is: " + response.tracks.items[0].name + "\n"
          + "Preview url: " + response.tracks.items[0].preview_url + "\n"
          + "----------------------";
        console.log(consoleLog);

        fs.appendFile("log.txt", "\nSpotify-this:\n" + consoleLog, function(err){
          if(err){
            console.log(err);
          }
        });
      }


      // response.tracks.items.forEach( function(item){
      //   console.log("Album name is: " + item.album.name + "\n" +
      //     "Artist name is: " + item.album.artists[0].name + "\n"
      //     + "Song name is: " + item.name + "\n"
      //     + "Preview url: " + item.preview_url);
      //   console.log("=========================");
      // });

    }).catch(function(err) {
        console.log(err);
    });
}

function movieThis(title){

  var title = title;

  request("https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=40e9cece" , function(error, response, body){

    if(!error && response.statusCode === 200){

      var bodyObj = JSON.parse(body);

      let consoleLog = "Title :" + bodyObj.Title + "\n"
        + "Year :" + bodyObj.Year + "\n"
        + "IMDB Rating :" + bodyObj.imdbRating + "\n"
        + "Rotten Tomatoes Rating: " + bodyObj.Ratings[1].Value + "\n"
        + "Country of origin: " + bodyObj.Country + "\n"
        + "Language: " + bodyObj.Language + "\n"
        + "Plot: " + bodyObj.Plot + "\n"
        + "Actors: " + bodyObj.Actors + "\n"
        + "---------------------";

      console.log(consoleLog);

      fs.appendFile("log.txt", "\nMovie-this:\n" + consoleLog, function(err){
          if(err){
            console.log(err);
          }
      });
    }
  })
}

function showMyTweets(){

  var client = new twitter({
          consumer_key: keys.consumer_key,
          consumer_secret: keys.consumer_secret,
          access_token_key: keys.access_token_key,
          access_token_secret: keys.access_token_secret
      });
       
  var params = {screen_name: 'J_Amoli' , count: 10};

  client.get('statuses/user_timeline', params, function(error, tweets, response) {

      if (!error) {

        var consoleLog = "";
        for(var i=0;i<tweets.length; i++){
          consoleLog += tweets[i].text + "\n";
        }

        consoleLog += "------------------";
        console.log(consoleLog);

        fs.appendFile("log.txt", "\nMy Tweets:\n" + consoleLog, function(err){
          if(err){
            console.log(err);
          }
      });
      }
      // console.log(response);
  });

}