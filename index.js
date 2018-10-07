const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const utils = require('req-res-utils'); 
const favorites = require('./src/favorites');
const movies = require('./src/movies');
const { ApolloServer } = require('apollo-server-express');

const port = process.env.PORT || 4000;
const service_name = process.env.SERVICE_NAME || 'movie-search';
const failPercent = process.env.FAIL_PERCENT || 0;

// Put together a schema
const resolvers = require('./src/resolvers');
const typeDefs = require('./src/schema');

const server = new ApolloServer({
  typeDefs,
  resolvers
});

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

// Apply the express middleware
server.applyMiddleware({app});

app.listen(port, () => {
  console.log(`${service_name} listening on port ${port}!`);
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  console.log(`Failure rate is set to ${failPercent}`);
});
