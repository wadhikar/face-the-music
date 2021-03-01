const express = require('express');
const open = require('open');
const multer = require('multer');
const asyncHandler = require('express-async-handler');
const cors = require('cors');

const spotifyAPI = require('../helpers/spotify-api');
const spotifyTrim = require('../helpers/spotify-trim');
const {
  createImageURL, faceClient, faceDetectFromStreamOptionalParams, getHighestEmotion
} = require('../helpers/azure-face-scan');
const { play } = require('../helpers/spotify-api');

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
      let spotifyURI = 'spotify:playlist:' + playlistId;
      
      // (async () => {
      //   await open(spotifyExternalURL);
      // })(); 
      (async () => {
        await open(spotifyURI);
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

router.post('/api/upload', cors(), apiUpload, asyncHandler(async(req, res, next) => {
  
  console.log("Received request from FileInput");

  console.log("Headers: " + req.headers[0] + '\n');
  console.log("Params: " + req.params[0] + '\n');
  console.log("Body: " + req.body[0] + '\n');
  console.log("File: " + req.file + '\n');
  // console.log("Files: " + req.files[0] + '\n');

  // console.log("Is buffer populated? " + req.files);
  // console.log("Is buffer populated? ");
  // console.log(req.files);
  
  for (const item in req.file) {
    // console.log("key: " + key);
    console.log(item);
    // console.log(value);
  }

  // Can pass buffer to Face API
  const image = req.file.buffer;
  let emotion = '';
  let results = [];
  let playlistId = '';

  console.log("1st msg: Received request from FileInput");

  console.log("res._headers >>>>>>>" + JSON.stringify(res._headers));

  console.log("Image Buffer: ", image);

  await faceClient.face
    .detectWithStream(image, faceDetectFromStreamOptionalParams)
    .then(result => {
      console.log("The result is: ");
      console.log(result);
      console.log("The emotions are: ");
      console.log(result[0].faceAttributes.emotion);
      emotion = getHighestEmotion(result[0].faceAttributes.emotion);
      console.log("The strongest emotion is: ", emotion);
      // next();
    });
  
  console.log("res._headers >>>>>>>" + JSON.stringify(res._headers));
  
  // Currently stops here, probably because tries to execute but emotion value isn't set in promise
  // Might also have issues with multiple requests happening since SpotifyAPI probably does so under the hood
  console.log("Getting playlist after Face API: ", emotion);

  await spotifyAPI.clientCredentialsGrant().then(
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
  
  console.log("res._headers >>>>>>>" + JSON.stringify(res._headers));

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
  });

  console.log("res._headers >>>>>>>" + JSON.stringify(res._headers));

  await spotifyAPI.getPlaylistsForCategory('mood', {
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

    playlistId = spotifyTrim.getRandomPlaylistId(results);
    // let spotifyExternalURL = spotifyTrim.buildOpenSpotifyURL(playlistId);
    
    // (async () => {
    //   await open(spotifyExternalURL);
    // })();
    
  }, function(err) {
    console.log("Something went wrong!", err);
    next(err);
  });

  console.log("res._headers >>>>>>>" + JSON.stringify(res._headers));

  res.json({
    uri: 'spotify:playlist:' + playlistId,
    embedded: 'https://open.spotify.com/embed/playlist/' + playlistId,
  });

}));

// /* 
// Endpoint for React App
// Receive image data in request.
// Get playlist and return URI and external URL
// */
// // const apiUpload = upload.fields([
// //   { name: 'image' }
// // ]);
// const apiUpload = upload.single('userImage');

// router.post('/api/upload', cors(), apiUpload, function(req, res, next) {
  
//   console.log("Received request from FileInput");

//   console.log("Headers: " + req.headers[0] + '\n');
//   console.log("Params: " + req.params[0] + '\n');
//   console.log("Body: " + req.body[0] + '\n');
//   console.log("File: " + req.file + '\n');
//   // console.log("Files: " + req.files[0] + '\n');

//   // console.log("Is buffer populated? " + req.files);
//   // console.log("Is buffer populated? ");
//   // console.log(req.files);
  
//   for (const item in req.file) {
//     // console.log("key: " + key);
//     console.log(item);
//     // console.log(value);
//   }

//   // Can pass buffer to Face API
//   const image = req.file.buffer;
//   let emotion = '';
//   let results = [];
//   let playlistId = '';

//   console.log("1st msg: Received request from FileInput");

//   // console.log("Image Buffer: ", image);
//   (async () => {
//     await faceClient.face
//       .detectWithStream(image, faceDetectFromStreamOptionalParams)
//       .then(result => {
//         console.log("The result is: ");
//         console.log(result);
//         console.log("The emotions are: ");
//         console.log(result[0].faceAttributes.emotion);
//         emotion = getHighestEmotion(result[0].faceAttributes.emotion);
//         console.log("The strongest emotion is: ", emotion);
//         next();
//       });
    
//     // Currently stops here, probably because tries to execute but emotion value isn't set in promise
//     // Might also have issues with multiple requests happening since SpotifyAPI probably does so under the hood
//     console.log("Getting playlist after Face API: ", emotion);

//     await spotifyAPI.clientCredentialsGrant().then(
//       function(data) {
//         console.log("Received token!");
        
//         // Set access token for use in future calls
//         spotifyAPI.setAccessToken(data.body['access_token']);
//       },
//       function(err) {
//         console.log(
//           'Something went wrong when retrieving an access token',
//           err.message
//         )
//         next(err);
//       }
//     )
    
//     await spotifyAPI.getPlaylistsForCategory('mood', {
//       country: 'CA',
//       limit : 50,
//       offset : 0
//     })
//     .then(function(data) {
//       console.log("Received results!");
//       let emotionPlaylists = spotifyTrim.getPlaylistsFromFaceEmotion(emotion, data.body)
//       results.push(emotionPlaylists);
      
//     }, function(err) {
//       console.log("Something went wrong!", err);
//       next(err);
//     });
//     await spotifyAPI.getPlaylistsForCategory('mood', {
//       country: 'CA',
//       limit : 50,
//       offset : 50
//     })
//     .then(function(data) {
//       console.log("Received results!");
//       let emotionPlaylists = spotifyTrim.getPlaylistsFromFaceEmotion(emotion, data.body)
//       results.push(emotionPlaylists);

//       // Ensure our array is flat
//       results = results.flat();

//       playlistId = spotifyTrim.getRandomPlaylistId(results);
//       console.log(playlistId);
//       // let spotifyExternalURL = spotifyTrim.buildOpenSpotifyURL(playlistId);
      
//       // (async () => {
//       //   await open(spotifyExternalURL);
//       // })();

//       // return res.status().json({
//       //   uri: 'spotify:playlist:' + playlistId,
//       //   embedded: 'https://open.spotify.com/embed/playlist/' + playlistId,
//       // });
      
//     }, function(err) {
//       console.log("Something went wrong!", err);
//       next(err);
//     });

//     res.json({
//       uri: 'spotify:playlist:' + playlistId,
//       embedded: 'https://open.spotify.com/embed/playlist/' + playlistId,
//     });
//   })();

//   // File is being sent
//   console.log("finished async function");

//   // res.status(200).send('Finished operations')
// });

module.exports = router;
