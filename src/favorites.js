const R = require('ramda');
const movieHelpers = require('./movies');

// Our in memory db for this sample
let storedFavorites = [];

const getFavoriteMovies = () => R.map(movieId => movieHelpers.movieById(movieId))(storedFavorites);

const readFavorites = () => storedFavorites;

const addMovieIds = (favorites, movieIds) => R.union(favorites, movieIds); 

const removeMovieIds = (favorites, movieIds) => R.without(movieIds, favorites);

const filterValidIds = movieIds => R.filter(movieHelpers.checkIfValidMovieId)(movieIds);

const saveFavorites = favorites => {
  storedFavorites = favorites
}

const addToFavorites = (movieIds, favorites) => {
  const addMovieIdsToFavorites = R.curry(addMovieIds)(favorites);
  return R.pipe(
    filterValidIds,
    addMovieIdsToFavorites
  )(movieIds);
};

const removeFromFavorites = (movieIds, favorites) => {
  const removeMovieIdsFromFavorites = R.curry(removeMovieIds)(favorites);
  return R.pipe(
    filterValidIds, 
    removeMovieIdsFromFavorites
  )(movieIds);
};

const getAddMovieIds = favoriteOps => {
  if (favoriteOps.hasOwnProperty('addMovieIds')) {
    return R.map(parseInt)(favoriteOps.addMovieIds.split(','));
  } else {
    return [];
  }
};

const getRemoveMovieIds = favoriteOps => {
  if (favoriteOps.hasOwnProperty('removeMovieIds')) {
    return R.map(parseInt)(favoriteOps.removeMovieIds.split(','));
  } else {
    return [];
  }
};

const performFavoritesOps = (favoriteOps, favorites) => {
  const addIds = getAddMovieIds(favoriteOps);
  const removeIds = getRemoveMovieIds(favoriteOps);

  const addToFavoritesForIds = R.curry(addToFavorites)(addIds);
  const removeFromFavoritesForIds = R.curry(removeFromFavorites)(removeIds);

  return R.pipe(
    addToFavoritesForIds,
    removeFromFavoritesForIds
  )(favorites);
};

const createFavoritesResponse = (favoriteOps, omitDataTag=false) => {
  storedFavorites = performFavoritesOps(favoriteOps, storedFavorites);
  if (omitDataTag) {
    return getFavoriteMovies()
  } else {
    return {
      data: getFavoriteMovies()
    }  
  }
};

module.exports = {
  getAddMovieIds: getAddMovieIds,
  getRemoveMovieIds: getRemoveMovieIds,
  readFavorites: readFavorites,
  addToFavorites: addToFavorites,
  removeFromFavorites: removeFromFavorites,
  performFavoritesOps: performFavoritesOps,
  saveFavorites: saveFavorites,
  getFavoriteMovies: getFavoriteMovies,
  createFavoritesResponse: createFavoritesResponse 
}
