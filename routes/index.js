const express = require('express');
const open = require('open');
const spotifyAPI = require('../helpers/spotify-api');
const spotifyTrim = require('../helpers/spotify-trim');
const multer = require('multer');

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
    let emotionPlaylists = spotifyTrim.getEmotionPlaylists(emotion, data.body)
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
      let emotionPlaylists = spotifyTrim.getEmotionPlaylists(emotion, data.body)
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

module.exports = router;
