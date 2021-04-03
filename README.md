# Face the Music

> What are you in the mood for today?

A Node/Express app that uses emotion data to find the user a suitable playlist for their current mood.

I decided to embark on a project that I felt that I could continue working on in the future. It uses new technologies that are becoming more popular in facial recognition, as seen extensively in apps like Snapchat.

## Features

Browse Spotify for a suitable playlist when inputting a mood. It will randomly select a suitable playlist and open it in the system browser, allowing the user to log into Spotify if they so wish.

Currently finding suitable playlists with predefined keywords.

## Live Demo

Want to try out the app?

[Check it out.](https://face-the-music.herokuapp.com/ "Deployed on Heroku") 👈

#### Future Features

- ~~Implement Azure Face API where user can submit selfie to scan current emotions as the input~~
- ~~Use Spotify Embedded Widgets if user does not want to leave app~~
- Offer a text emotion search to search for moods outside of those offered by Face API (eg: romantic, sleepy, curious(new releases), etc)
- Browse various Spotify Categories, not just the Mood Category
- Add support for Apple Music
- List results of playlist for inputted mood to allow user to make a selection vs the current randomization

## Installation

```bash
$ yarn install
```

## Configuration

Create a .env file in the project root directory for the Spotify API and Azure Face API credentials for testing on your local. They can be created/retrieved from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) and from [Azure's Console](https://portal.azure.com/).

The format that this app looks for is:

```
SPOTIFY_CLIENT_ID=<Your Spotify client id>
SPOTIFY_CLIENT_SECRET=<Your Spotify client secret>
FACE_KEY=<Your Azure Face API Key>
FACE_END_POINT=<Your Azure Face API endpoint>
```

## Usage

```bash
$ yarn start
Server running at http://localhost:3000
```

## Licensing

The code in this project is licensed under the GNU AGPLv3 license.
