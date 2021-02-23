const express = require('express');
const open = require('open');
const multer = require('multer');

const spotifyAPI = require('../helpers/spotify-api');
const spotifyTrim = require('../helpers/spotify-trim');
const {
  createImageURL, faceClient, faceDetectFromStreamOptionalParams, getHighestEmotion
} = require('../helpers/azure-face-scan');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
  
  // TODO #6 If access_token is expired, only then get and set new access_token
  // Upon loading homepage, get and set access token for all future requests
    spotifyAPI.clientCredentialsGrant().then(
    function(data) {
      console.log("Received token!");
      
      // Set access token for use in future calls
      spotifyAPI.setAccessToken(data.body['access_token']);
    },
    function(err) {
      console.log(
        'Something went wrong when retrieving an access token',
        err.message
      )
      next(err);
    }
  )
  res.render('index', { title: 'Face the Music' });
});

/* POST for Spotify request and open a playlist. */
router.post('/playlist', function(req, res, next) {

  const emotion =  req.body.mood;
  let results = [];
  
  spotifyAPI.getPlaylistsForCategory('mood', {
    country: 'CA',
    limit : 50,
    offset : 0
  })
  .then(function(data) {
    console.log("Received results!");
    let emotionPlaylists = spotifyTrim.getPlaylistsFromUserEmotion(emotion, data.body)
    results.push(emotionPlaylists);
    
  }, function(err) {
    console.log("Something went wrong!", err);
    next(err);
  })
  .then(
    spotifyAPI.getPlaylistsForCategory('mood', {
      country: 'CA',
      limit : 50,
      offset : 50
    })
    .then(function(data) {
      console.log("Received results!");
      let emotionPlaylists = spotifyTrim.getPlaylistsFromUserEmotion(emotion, data.body)
      results.push(emotionPlaylists);

      // Ensure our array is flat
      results = results.flat();

      let playlistId = spotifyTrim.getRandomPlaylistId(results);
      let spotifyExternalURL = spotifyTrim.buildOpenSpotifyURL(playlistId);
      
      (async () => {
        await open(spotifyExternalURL);
      })();
      
    }, function(err) {
      console.log("Something went wrong!", err);
      next(err);
    })
  );

  res.redirect('/')
});

/* 
POST image for scanning with Azure Face API. 
Use the returned emotions to find a corresponding playlist
Use cloudinary to upload selfie to get URL to image.
Use said URL to send to Face API.
*/
router.post('/upload', upload.single('selfie'), function(req, res, next) {
  
  // Need to figure out how to read buffer
  const image = req.file.buffer;
  let emotion = '';
  let results = [];

  console.log("Image Buffer: ", image);

  (async () => {
    await faceClient.face
      .detectWithStream(image, faceDetectFromStreamOptionalParams)
      .then(result => {
        console.log("The result is: ");
        console.log(result);
        console.log("The emotions are: ");
        console.log(result[0].faceAttributes.emotion);
        emotion = getHighestEmotion(result[0].faceAttributes.emotion);
        console.log("The strongest emotion is: ", emotion);
        next();
      });
    
    // Currently stops here, probably because tries to execute but emotion value isn't set in promise
    // Might also have issues with multiple requests happening since SpotifyAPI probably does so under the hood
    console.log("Getting playlist after Face API: ", emotion);
    
    await spotifyAPI.getPlaylistsForCategory('mood', {
      country: 'CA',
      limit : 50,
      offset : 0
    })
    .then(function(data) {
      console.log("Received results!");
      let emotionPlaylists = spotifyTrim.getPlaylistsFromFaceEmotion(emotion, data.body)
      results.push(emotionPlaylists);
      
    }, function(err) {
      console.log("Something went wrong!", err);
      next(err);
    })
    .then(
      spotifyAPI.getPlaylistsForCategory('mood', {
        country: 'CA',
        limit : 50,
        offset : 50
      })
      .then(function(data) {
        console.log("Received results!");
        let emotionPlaylists = spotifyTrim.getPlaylistsFromFaceEmotion(emotion, data.body)
        results.push(emotionPlaylists);

        // Ensure our array is flat
        results = results.flat();

        let playlistId = spotifyTrim.getRandomPlaylistId(results);
        let spotifyExternalURL = spotifyTrim.buildOpenSpotifyURL(playlistId);
        
        (async () => {
          await open(spotifyExternalURL);
        })();
        
      }, function(err) {
        console.log("Something went wrong!", err);
        next(err);
      })
    )
    }
  )();
  
  res.redirect('/')

});

module.exports = router;
