const R = require('ramda');
const utils = require('req-res-utils'); 

// Load sample data
const indexedMovies = require('../data/indexed_movies.json');
const movies = require('../data/movie_details3.json');
const genres = require('../data/genres.json');

const PosterSize = {
  SMALL: 'w154',
  MEDIUM: 'w342',
  LARGE: 'w780'
};

const ProfileImageSize = {
  SMALL: 'w185',
  LARGE: 'w632'
}

const movieById = movieId => indexedMovies[movieId];
const checkIfValidMovieId = movieId => {
  const movie = movieById(movieId);
  return typeof movie != 'undefined';
};

const filterValidIds = movieIds => R.filter(checkIfValidMovieId)(movieIds);

const getReleaseYear = movie => movie.releaseDate.slice(0, 4);

const getPoster = (movie, size) => {
  return {
    fullPath: `https://image.tmdb.org/t/p/${size}${movie.posterPath}`,
    size: size
  };
};

const getProfileImage = (actor, size) => {
  return {
    fullPath: `https://image.tmdb.org/t/p/${size}${actor.profilePath}`,
    size: size
  };
};

const ratingFilter = rating => {
  return movie => movie.rating >= rating;
};

const genreFilter = genre => {
  return movie => {
    let genreObj = R.find(R.propEq('name', genre))(genres);
    if (typeof genreObj == 'undefined') {
      throw Error(`Genre ${genre} is unknown`);
    }
    return R.contains({ name: genreObj.name, id: genreObj.id })(movie.genres);
  };
};

const createMoviesResponse = (args, ignorePathResolution=false, inputMovies=movies) => {
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

  const posterSize = PosterSize[args.posterSize || 'MEDIUM'];
  const profileImageSize = ProfileImageSize[args.profileImageSize || "SMALL"];

  const filterMovies = R.curry(utils.filterItems)(args, filters);
  const pageMovies = R.curry(utils.paging.getPagedItems)(args);
  const resolvePaths = R.map(
    movie => {
      movie.poster = getPoster(movie, posterSize)
      movie.cast = R.map(
        actor => {
          actor.profileImage = getProfileImage(actor, profileImageSize);
          return actor;
        }
      )(movie.cast);
      return movie;
    }
  )
  if (ignorePathResolution) {
    return R.pipe(
      filterMovies,
      pageMovies
    )(inputMovies);
  } else {
    return R.pipe(
      filterMovies,
      resolvePaths,
      pageMovies,
    )(inputMovies);
  }
}

const getGenres = () => genres;

module.exports = {
  createMoviesResponse: createMoviesResponse,
  movieById: movieById,
  filterValidIds: filterValidIds,
  getGenres: getGenres,
  getReleaseYear: getReleaseYear,
  getPoster: getPoster,
  getProfileImage: getProfileImage,
  PosterSize: PosterSize,
  ProfileImageSize: ProfileImageSize
}
