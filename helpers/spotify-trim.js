const happy = ['good', 'upbeat', 'boost', 'happy', 'brighten', 'smile'];
const sad = ['lonely', 'down', 'sucks', 'emo', 'broken', 'rainy', 'gut', 'blues', 'sentimental', 'feels', 'dark', 'melancholy', 'fade', 'melancholia']; 
const angry = ['loud', 'dramatic', 'pounding'];
const relaxed = ['soft', 'smooth', 'relax', 'chill', 'cozy', 'relaxing', 'piano'];
const motivated = ['top', 'work', 'free', 'bangers'];

module.exports.getEmotionPlaylists = function(emotion, spotifyJSONResponse) {

    let playlists = [];
    if (spotifyJSONResponse) {
        playlists = spotifyJSONResponse.playlists.items;
    }
    
    let emotionPlaylists = [];

    // Intialized here since let is block scoped
    let emotionWords = [];

    switch (emotion) {
        case 'Sad':
            emotionWords = sad;
            break;
        case 'Angry':
            emotionWords = angry;
            break;
        case 'Relaxed':
            emotionWords = relaxed;
            break;
        case 'Motivated':
            emotionWords = motivated;
            break;
        case 'Happy':
            emotionWords = happy;
    }

    // Iterate through object and store the playlists that match the given emotion
    for (const playlist of playlists) {
        if (emotionWords.some(v => playlist.description.toLowerCase().includes(v))) {
            // Push Playlist object to array
            emotionPlaylists.push(playlist)
        }
    }

    return emotionPlaylists;
}

module.exports.getRandomPlaylistId = function(playlists) {
    let playlistId = "";
    let random = Math.floor(Math.random() * playlists.length);
    if (playlists) {        
        playlistId = playlists[random].id;
    }
    return playlistId;
}

module.exports.buildOpenSpotifyURL = function (playlistId) {
    const openPrefix = "https://open.spotify.com/playlist/";
    let id = "";
    if (playlistId) {
        id = playlistId;
    }

    let openSpotifyURL = openPrefix + id;
    return openSpotifyURL;
}

