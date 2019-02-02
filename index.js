const express = require('express');
const bodyParser = require('body-parser');
const utils = require('req-res-utils'); 
const favorites = require('./src/favorites');
const movies = require('./src/movies');

const port = process.env.PORT || 4000;
const service_name = process.env.SERVICE_NAME || 'movie-search';
const failPercent = process.env.FAIL_PERCENT || 0;

// Initialize the app
const app = express();

app.use(
  bodyParser.json(),
  (req, res, next) => {
    const incomingHeaders = req.headers;
    const headers = Object.assign(
      utils.getCORSHeaders(),
      utils.forwardTraceHeaders(incomingHeaders)
    );
    res.set(headers);
    if (Math.random() < failPercent) {
      // Simulate a failure
      console.log("Failing");
      res.sendStatus(500);
    } else if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }  
  }
);

// Simple restful movies endpoint
app.get('/movies', (req, res) => {
  try {
    const moviesResponse = movies.createMoviesResponse(req.query)
    res.send(moviesResponse);
  } catch (error) {
    console.log(error);
    res.send({ error: error.message });
  }
});

app.get('/genres', (req, res) => {
  try {
    const genresResponse = movies.getGenres()
    res.send(genresResponse);
  } catch (error) {
    console.log(error);
    res.send({ error: error.message });
  }
});

app.get('/favorites', (req, res) => {
  try {
    const favoritesResponse = favorites.createFavoritesResponse(req.query, req.body);
    res.send(favoritesResponse);
  } catch (error) {
    console.log(error);
    res.send({ error: error.message });
  }
});

app.patch('/favorites', (req, res) => {
  try {
    const favoritesResponse = favorites.createFavoritesResponse(req.query, req.body);
    res.send(favoritesResponse);   
  } catch (error) {
    console.log(error);
    res.send({ error: error.message });
  }
});

const path = require('path');
const dir = path.join(__dirname, 'public');
app.use(express.static(dir));

app.listen(port, () => {
  console.log(`${service_name} listening on port ${port}!`);
  console.log(`Failure rate is set to ${failPercent}`);
});
