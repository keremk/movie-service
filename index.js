const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const R = require('ramda');
const utils = require('req-res-utils'); 
const favorites = require('./src/favorites');

const port = process.env.PORT || 3030
const service_name = process.env.SERVICE_NAME || 'movie-search'
const failPercent = process.env.FAIL_PERCENT || 0;

// Running offline or online
const mode = process.env.npm_package_config_mode;

// Load sample data
const movies = require('./data/movie_details3.json');
const genres = require('./data/genres.json');

// Helper functions
const movieById = movieId => R.find(R.propEq('id', movieId))(movies);
const checkIfValidMovieId = movieId => {
  const movie = movieById(movieId);
  return typeof movie != 'undefined';
};

const resolvePosterPath = (path, size) => (mode == "offline") ? `http://localhost:3030/images/w342${path}` :
  `https://image.tmdb.org/t/p/${size}${path}`

const ratingFilter = rating => {
  return movie => movie.rating >= rating;
};

const genreFilter = genre => {
  return movie => {
    let genreObj = R.find(R.propEq('name', genre))(genres.genres);
    if (typeof genreObj == 'undefined') {
      throw Error(`Genre ${genre} is unknown`);
    }
    return R.contains({ name: genreObj.name, id: genreObj.id })(movie.genres);
  };
};

const createMoviesResponse = (args) => {
  const filters = [
    {
      "name": "rating", 
      "action": ratingFilter 
    },
    {
      "name": "genre",
      "action": genreFilter
    }
  ];
  const filterMovies = R.curry(utils.filterItems)(args, filters);
  const pageMovies = R.curry(utils.paging.getPagedItems)(args);
  const substituteFullPosterPath = R.map(
    movie => {
      movie.posterPath = resolvePosterPath(movie.posterPath, "w342")
      return movie
    }
  )
  return R.pipe(
    filterMovies,
    substituteFullPosterPath,
    pageMovies,
  )(movies);
}

// GraphQL schema definition
const typeDefs = `
  type Query { 
    allMovies(genre: String, rating: Float, offset: Int, limit: Int): MovieCollection! 
    genres: [String!]
    favorites: [Movie!]
  }
  type Mutation {
    addFavorite (movieId: Int!) : [Movie!]
    removeFavorite (movieId: Int!): [Movie!]
  }
  type PageInfo {
    limit: Int!
    offset: Int!
    total: Int!
  }
  type MovieCollection {
    metadata: PageInfo!
    data: [Movie!]
  }
  enum ProfileImageSize {
    SMALL
    LARGE
  }
  enum PosterSize {
    SMALL
    MEDIUM
    LARGE
  }
  type Poster {
    size: PosterSize,
    fullPath: String!
  }
  type ProfileImage {
    size: ProfileImageSize,
    fullPath: String!
  }
  type Actor { 
    name: String!
    character: String
    profileImage(size: ProfileImageSize!): ProfileImage 
  }
  type Movie { 
    id: Int! 
    title: String!
    tagline: String
    overview: String
    releaseYear: String
    releaseDate: String
    popularity: Float
    rating: Float!
    ratingCount: Int
    runtime: Int
    revenue: Int
    budget: Int
    originalLanguage: String
    poster(size: PosterSize!): Poster
    genres: [String!]
    cast: [Actor!] 
  }
`;

// Resolvers
const resolvers = {
  PosterSize: {
    SMALL: 'w154',
    MEDIUM: 'w342',
    LARGE: 'w780'
  },
  ProfileImageSize: {
    SMALL: 'w185',
    LARGE: 'w632'
  },
  Query: {
    allMovies: (root, args) => {
      console.log(args);
      return createMoviesResponse(args);
    },
    favorites: () => favorites.getFavoriteMovies(),
    genres: () => R.map(v => v.name)(genres.genres)
  },
  Mutation: {
    addFavorite: (_, { movieId }) => {
      const favoritesResponse = favorites.createFavoritesResponse(
        { addMovieIds: `${movieId}` }, true);
      return favoritesResponse;
    },
    removeFavorite: (_, { movieId }) => {
      const favoritesResponse = favorites.createFavoritesResponse(
        { removeMovieIds: `${movieId}` }, true);
      return favoritesResponse;
    }
  },
  Movie: {
    releaseYear: movie => movie.releaseDate.slice(0, 4),
    poster: (movie, args) => {
      return {
        fullPath: resolvePosterPath(movie.posterPath, args.size),
        size: args.size
      };
    },
    genres: movie => R.map(v => v.name)(movie.genres)
  },
  Actor: {
    profileImage: (actor, args) => {
      return {
        fullPath: `https://image.tmdb.org/t/p/${args.size}${actor.profilePath}`,
        size: args.size
      };
    }
  }
};

// Put together a schema
const schema = makeExecutableSchema({
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

// The GraphQL endpoint
app.use(
  '/graphql',
  graphqlExpress({ schema })
);

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Simple restful movies endpoint
app.get('/movies', (req, res) => {
  try {
    const moviesResponse = createMoviesResponse(req.query)
    res.send(moviesResponse);
  } catch (error) {
    console.log(error);
    res.send({ error: error.message });
  }
});

app.get('/favorites', (req, res) => {
  try {
    const favoritesResponse = favorites.createFavoritesResponse(req.body);
    res.send(favoritesResponse);
  } catch (error) {
    console.log(error);
    res.send({ error: error.message });
  }
});

app.patch('/favorites', (req, res) => {
  try {
    const favoritesResponse = favorites.createFavoritesResponse(req.body);
    res.send(favoritesResponse);   
  } catch (error) {
    console.log(error);
    res.send({ error: error.message });
  }
});

const path = require('path');
const dir = path.join(__dirname, 'public');
app.use(express.static(dir));

// Start the server
app.listen(port, () => {
  console.log(`${service_name} listening on port ${port}!`);
  console.log(`Running mode: ${mode}`);
  console.log(`Go to http://localhost:${port}/graphiql to run queries!`);
  console.log(`Failure rate is set to ${failPercent}`);
});
