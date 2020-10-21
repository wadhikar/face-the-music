const express = require('express');
const spotifyAPI = require('../helpers/spotifyAPI');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  // Upon loading homepage, get and set access token for all future requests
  spotifyAPI.clientCredentialsGrant().then(
    function(data) {
      
      // Basic debugging
      // console.log('The access token expires in ' + data.body['expires_in']);
      // console.log('The access token is ' + data.body['access_token']);

      // Set access token for use in future calls
      spotifyAPI.setAccessToken(data.body['access_token']);
    },
    function(err) {
      // console.log(
      //   'Something went wrong when retrieving an access token',
      //   err.message
      // )
    }
  )
  res.render('index', { title: 'Express' });
});

module.exports = router;
