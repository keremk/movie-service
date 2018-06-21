const favoritesHelper = require('../src/favorites');
const R = require('ramda');

test('add multiple ids to favorites', () => {
  const ids = [1893, 680];
  const favorites = [1726];

  expect(favoritesHelper.addToFavorites(ids, favorites)).toEqual([1726, 1893, 680]);  
});

test('add invalid ids to favorites has no effect', () => {
  const ids = [-1];
  const favorites = [1726];

  expect(favoritesHelper.addToFavorites(ids, favorites)).toEqual(favorites);  
});

test('add existing ids to favorites has no effect', () => {
  const ids = [1726];
  const favorites = [1726];

  expect(favoritesHelper.addToFavorites(ids, favorites)).toEqual(favorites);  
});

test('remove multiple ids from favorites', () => {
  const ids = [1893, 680];
  const favorites = [1726, 1893, 680];

  expect(favoritesHelper.removeFromFavorites(ids, favorites)).toEqual([1726]);  
});

test('remove non-existing ids from favorites have no effect', () => {
  const ids = [680];
  const favorites = [1726, 1893];

  expect(favoritesHelper.removeFromFavorites(ids, favorites)).toEqual(favorites);  
});

test('remove invalid movieIds from favorites have no effect', () => {
  const ids = [-1];
  const favorites = [1726, 1893];

  expect(favoritesHelper.removeFromFavorites(ids, favorites)).toEqual(favorites);  
});

test('extract movieIds', () => {
  const ops = {
    addMovieIds: "1893,680",
    removeMovieIds: "1726"
  }

  expect(favoritesHelper.getAddMovieIds(ops)).toEqual([1893, 680]);
  expect(favoritesHelper.getRemoveMovieIds(ops)).toEqual([1726]); 
});

test('perform add/remove operations', () => {
  const ops = {
    addMovieIds: "1893,680",
    removeMovieIds: "1726"
  }
  const favorites = [1726, 1893];

  expect(favoritesHelper.performFavoritesOps(ops, favorites)).toEqual([1893, 680]);
});

test('performing no ops returns the input favorites', () => {
  const ops = {};
  const favorites = [1726, 1893];

  expect(favoritesHelper.performFavoritesOps(ops, favorites)).toEqual(favorites);
});

test('read and save to stored favorites', () => {
  const favorites = [1726, 1893];

  favoritesHelper.saveFavorites(favorites);
  const storedFavorites = favoritesHelper.readFavorites();

  expect(storedFavorites).toEqual([1726, 1893]);
});