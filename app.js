const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const queryString = require('querystring');
const dotenv = require('dotenv');
const SpotifyWebApi = require('spotify-web-api-node');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');

const { FaceClient, FaceModels } = require("@azure/cognitiveservices-face");
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");

const spotifyAPIConfig = require('./helpers/spotify-api');
const spotifyTrim = require('./helpers/spotify-trim')

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

dotenv.config();

const app = express();

app.set('environment', process.env.NODE_ENV); 


// view engine setup
// app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, './frontend/build')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send the error as JSON
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
