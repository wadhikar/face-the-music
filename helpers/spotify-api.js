const dotenv = require('dotenv');
const SpotifyWebApi = require('spotify-web-api-node');

dotenv.config();

const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

// API can be imported into app.js and accessed everywhere
module.exports = spotifyAPI;