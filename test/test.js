const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const spotifyAPI = require('../helpers/spotify-api');


describe('GET /', function() {
    it('return homepage with status 200', function() {
      return request(app)
        .get('/')
        .expect(200)
    })
});

describe('POST /', function() {
    it('return homepage with status 200', function() {
        // TODO Handle Spotify API token in test, won't get attached for some reason.
        // Need to figure out how to integrate spotify-web-api-node into tests
        // Has been manually tested though
        return request(app)
        .post('/')
        .send({mood: 'Happy'})
        .expect(200)
    })
});