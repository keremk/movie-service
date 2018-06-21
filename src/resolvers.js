const movieHelpers = require('./movies.js')
const favoriteHelpers = require('./favorites.js');

// Resolvers
const resolvers = {
  PosterSize: movieHelpers.PosterSize,
  ProfileImageSize: movieHelpers.ProfileImageSize,
  Query: {
    allMovies: (_, args) => movieHelpers.createMoviesResponse(args, true),
    favorites: favoriteHelpers.getFavoriteMovies,
    genres: movieHelpers.getGenres
  },
  Mutation: {
    addFavorite: (_, { movieId }) => {
      return favoriteHelpers.createFavoritesResponse(
        { addMovieIds: `${movieId}` }, true);
    },
    removeFavorite: (_, { movieId }) => {
      return favoriteHelpers.createFavoritesResponse(
        { removeMovieIds: `${movieId}` }, true);
    }
  },
  Movie: {
    releaseYear: movieHelpers.getReleaseYear,
    poster: (movie, { size }) => movieHelpers.getPoster(movie, size)
  },
  Actor: {
    profileImage: (actor, { size }) => movieHelpers.getProfileImage(actor, size)
  }
};

module.exports = resolvers;