const R = require('ramda');

// Load sample data
const indexedMovies = require('../data/indexed_movies.json');
const movies = require('../data/movie_details3.json');
const genres = require('../data/genres.json');

// Helper functions
const movieById = movieId => indexedMovies[movieId];
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

const getGenres = R.map(genre => genre.name)(genres.genres);

module.exports = {
  createMoviesResponse: createMoviesResponse,
  movieById: movieById,
  checkIfValidMovieId: checkIfValidMovieId,
  getGenres: getGenres
}
