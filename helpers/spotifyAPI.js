const dotenv = require('dotenv');

dotenv.config();

const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

// API can be imported into app.js and accessed everywhere
module.exports = spotifyAPI;