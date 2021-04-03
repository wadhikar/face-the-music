const express = require('express');
const open = require('open');
const multer = require('multer');
const asyncHandler = require('express-async-handler');
const cors = require('cors');

const spotifyAPI = require('../helpers/spotify-api');
const spotifyTrim = require('../helpers/spotify-trim');
const {
  faceClient, faceDetectFromStreamOptionalParams, getHighestEmotion
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
      // Set access token for use in future calls
      spotifyAPI.setAccessToken(data.body['access_token']);
    },
    function(err) {
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
    let emotionPlaylists = spotifyTrim.getPlaylistsFromUserEmotion(emotion, data.body)
    results.push(emotionPlaylists);
    
  }, function(err) {
    next(err);
  })
  .then(
    spotifyAPI.getPlaylistsForCategory('mood', {
      country: 'CA',
      limit : 50,
      offset : 50
    })
    .then(function(data) {
      let emotionPlaylists = spotifyTrim.getPlaylistsFromUserEmotion(emotion, data.body)
      results.push(emotionPlaylists);

      // Ensure our array is flat
      results = results.flat();

      let playlistId = spotifyTrim.getRandomPlaylistId(results);
      let spotifyExternalURL = spotifyTrim.buildOpenSpotifyURL(playlistId);
      let spotifyURI = 'spotify:playlist:' + playlistId;
      
      (async () => {
        await open(spotifyURI);
      })();
      
    }, function(err) {
      next(err);
    })
  );

  res.redirect('/')
});

/* 
POST image for scanning with Azure Face API. 
Use the returned emotions to find a corresponding playlist
*/
router.post('/upload', upload.single('selfie'), function(req, res, next) {
  
  // Need to figure out how to read buffer
  const image = req.file.buffer;
  let emotion = '';
  let results = [];

  (async () => {
    await faceClient.face
      .detectWithStream(image, faceDetectFromStreamOptionalParams)
      .then(result => {
        emotion = getHighestEmotion(result[0].faceAttributes.emotion);
        next();
      });
    
    // Currently stops here, probably because tries to execute but emotion value isn't set in promise
    // Might also have issues with multiple requests happening since SpotifyAPI probably does so under the hood

    await spotifyAPI.getPlaylistsForCategory('mood', {
      country: 'CA',
      limit : 50,
      offset : 0
    })
    .then(function(data) {
      let emotionPlaylists = spotifyTrim.getPlaylistsFromFaceEmotion(emotion, data.body)
      results.push(emotionPlaylists);
      
    }, function(err) {
      next(err);
    })
    .then(
      spotifyAPI.getPlaylistsForCategory('mood', {
        country: 'CA',
        limit : 50,
        offset : 50
      })
      .then(function(data) {
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
        next(err);
      })
    )
    }
  )();
  
  res.redirect('/')

});

module.exports = router;
