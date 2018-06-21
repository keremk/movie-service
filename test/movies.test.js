const moviesHelper = require('../src/movies');
const R = require('ramda');

const testMovies = [
  {
    "id": 1893,
    "posterPath": "/n8V09dDc02KsSN6Q4hC2BX6hN8X.jpg",
    "releaseDate": "1999-05-19",
    "rating": 2.4,
    "genres": [{
      "id": 28,
      "name": "Action"
    }, {
      "id": 878,
      "name": "Science Fiction"
    }],
    "cast": [{
      "id": 3896,
      "profilePath": "/9mdAohLsDu36WaXV2N3SQ388bvz.jpg"
    }]
  },
  {
    "id": 1894,
    "posterPath": "/n8V09dDc02KsSN6Q4hC2BX6hN8X.jpg",
    "rating": 5.0,
    "genres": [{
      "id": 878,
      "name": "Science Fiction"
    }],
    "cast": [{
      "id": 3896,
      "profilePath": "/9mdAohLsDu36WaXV2N3SQ388bvz.jpg"
    }]
  }
];

test('filter valid movie ids', () => {
  const ids = [1893, 680, -1];

  expect(moviesHelper.filterValidIds(ids)).toEqual([1893, 680]);  
});

test('release year is extracted', () => {
  const movie = testMovies[0];

  expect(moviesHelper.getReleaseYear(movie)).toBe("1999");
});

test('paths are resolved to their defaults', () => {
  const response = moviesHelper.createMoviesResponse({}, false, testMovies);
  const movie = response.data[0];

  expect(movie.poster).toEqual({
    fullPath: `https://image.tmdb.org/t/p/w342${testMovies[0].posterPath}`,
    size: "w342"
  });
  expect(movie.cast[0].profileImage).toEqual({
    fullPath: `https://image.tmdb.org/t/p/w185${testMovies[0].cast[0].profilePath}`,
    size: "w185"
  });
});

test('paths are resolved to the specified ones', () => {
  const args = {
    posterSize: "SMALL",
    profileImageSize: "LARGE"
  };
  const response = moviesHelper.createMoviesResponse(args, false, testMovies);
  const movie = response.data[0];

  expect(movie.poster).toEqual({
    fullPath: `https://image.tmdb.org/t/p/w154${testMovies[0].posterPath}`,
    size: "w154"
  });
  expect(movie.cast[0].profileImage).toEqual({
    fullPath: `https://image.tmdb.org/t/p/w632${testMovies[0].cast[0].profilePath}`,
    size: "w632"
  });
});

test('ignore resolving paths', () => {
  const response = moviesHelper.createMoviesResponse({}, true, testMovies);
  const movie = response.data[0];

  expect(movie.poster).toBeUndefined;
  expect(movie.cast[0].profileImage).toBeUndefined;
});

test('movies are filtered by genre', () => {
  const args = {
    genre: "Action"
  };
  const response = moviesHelper.createMoviesResponse(args, false, testMovies);
 
  expect(response.data.length).toBe(1);
  expect(response.data[0].id).toBe(1893);
});

test('movies are filtered by genre & rating', () => {
  const args = {
    genre: "Science Fiction",
    rating: "4.0"
  };
  const response = moviesHelper.createMoviesResponse(args, false, testMovies);
 
  expect(response.data.length).toBe(1);
  expect(response.data[0].id).toBe(1894);
});

test('movies are paged', () => {
  const args = {
    limit: "1",
    offset: "0"
  };
  const response = moviesHelper.createMoviesResponse(args, false, testMovies);
 
  expect(response.data.length).toBe(1);
  expect(response.data[0].id).toBe(1893);
  expect(response.metadata).toEqual({
    offset: 0,
    limit: 1,
    total: 2
  });
});