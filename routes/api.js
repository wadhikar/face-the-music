const express = require('express');
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


/* 
Endpoint for React App
Receive image data in request.
Get playlist and return URI and external URL
*/
// const apiUpload = upload.fields([
//   { name: 'image' }, 
//   { name: 'title' }
// ]);
const apiUpload = upload.single('userImage');

router.post('/upload', cors(), apiUpload, asyncHandler(async(req, res, next) => {

  // Can pass buffer to Face API
  const image = req.file.buffer;
  let emotion = '';
  let results = [];
  let playlistId = '';

  await faceClient.face
    .detectWithStream(image, faceDetectFromStreamOptionalParams)
    .then(result => {
      // If result is empty, aka no faces detected, then return 400
      console.log(result);
      if (result.length === 0) {
        // res.status(400).send( "Couldn't detect a singular face! Make sure your face is alone and visible." );
        // return;
        const err = {
          message: "Couldn't detect a singular face! Make sure your face is alone and visible.",
          status: 400
        };
        return next(err);
      }
      emotion = getHighestEmotion(result[0].faceAttributes.emotion);
    });

  // If Face API didn't return a valid response, we need to stop execution
  if (emotion === '') {
    return;
  }

  await spotifyAPI.clientCredentialsGrant().then(
    function(data) {      
      // Set access token for use in future calls
      spotifyAPI.setAccessToken(data.body['access_token']);
    },
    function(err) {
      next(err);
    }
  )
  
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
  });

  await spotifyAPI.getPlaylistsForCategory('mood', {
    country: 'CA',
    limit : 50,
    offset : 50
  })
  .then(function(data) {
    let emotionPlaylists = spotifyTrim.getPlaylistsFromFaceEmotion(emotion, data.body)
    results.push(emotionPlaylists);

    // Ensure our array is flat
    results = results.flat();

    playlistId = spotifyTrim.getRandomPlaylistId(results);

  }, function(err) {
    next(err);
  });

  res.json({
    uri: 'spotify:playlist:' + playlistId,
    embedded: 'https://open.spotify.com/embed/playlist/' + playlistId,
  });

}));

module.exports = router;
