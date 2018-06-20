# Movie Service 

This is a sample service that serves mock movie data and provides a mock store for storing favorite movie ids. This service is an edge mock service intended to be used by mobile and Web (React etc.) clients.

This service provides 2 style of endpoints - REST & GraphQL

## REST Endpoint

### Get movie info

To access the list of movies, you can use:

``` 
GET /movies?genre=Drama&rating=6&offset=0&limit=10
```

with query parameters:

**genre** : to retrieve the movies filtered by a single genre (e.g. Drama). Make sure the genre name is capitalized.

**rating** : to retrieve the movies filtered by rating value greater than the one provided here.

**offset** (Optional): the offset value to start for paging, default is 0 

**limit** (Optional): the number of items per page, default is 100

The response will be:

``` javascript
{
    "metadata": {
        "offset": 1,
        "limit": 20,
        "total": 53
    },
    "data": [
        {
            "id": 398818,
            "title": "Call Me by Your Name",
            "tagline": "",
            "overview": "Elio Perlman is spending the summer with his family at their vacation home in Lombardy, Italy. When his father hires a handsome doctoral student, the curious 17-year-old finds himself developing a growing attraction to the young man.",
            "popularity": 24.219103,
            "rating": 8.3,
            "ratingCount": 2245,
            "runtime": 132,
            "releaseDate": "2017-09-01",
            "revenue": 40353565,
            "budget": 3500000,
            "posterPath": "https://image.tmdb.org/t/p/w342https://image.tmdb.org/t/p/w342https://image.tmdb.org/t/p/w342/nPTjj6ZfBXXBwOhd7iUy6tyuKWt.jpg",
            "originalLanguage": "en",
            "genres": [
                {
                    "id": 10749,
                    "name": "Romance"
                },
                {
                    "id": 18,
                    "name": "Drama"
                }
            ],
            "cast": [
                {
                    "id": 1190668,
                    "gender": 2,
                    "name": "Timothée Chalamet",
                    "character": "Elio Perlman",
                    "profilePath": "/gz5kyVsUzOratQmGHdDg3AnxP9h.jpg"
                },
                {
                    "id": 53807,
                    "gender": 2,
                    "name": "Armie Hammer",
                    "character": "Oliver",
                    "profilePath": "/2zq984Jrw53AxDshTQPKpTPGLe8.jpg"
                },
                {
                    "id": 72873,
                    "gender": 2,
                    "name": "Michael Stuhlbarg",
                    "character": "Samuel Perlman",
                    "profilePath": "/seBk12MUK51aUoYX4OW1itfOpJ6.jpg"
                },
                {
                    "id": 20577,
                    "gender": 1,
                    "name": "Amira Casar",
                    "character": "Annella Perlman",
                    "profilePath": "/cSKff4J5gT6vMW9EsAwFWwOIHb7.jpg"
                },
                {
                    "id": 935096,
                    "gender": 1,
                    "name": "Esther Garrel",
                    "character": "Marzia",
                    "profilePath": "/km79Neoe5tLwgbiBzq72pR7pdxY.jpg"
                },
                {
                    "id": 1592949,
                    "gender": 1,
                    "name": "Victoire Du Bois",
                    "character": "Chiara",
                    "profilePath": "/c5jlxSh0iHyBMVeqW5FS3qjIobP.jpg"
                },
                {
                    "id": 1789600,
                    "gender": 0,
                    "name": "Vanda Capriolo",
                    "character": "Mafalda",
                    "profilePath": "/oZz3RnL0veM2oxohNzLXiO9BUbr.jpg"
                }
            ]
        },...
		]
}
```


### Get list of favorites

To retrieve the list of favorites, you can use

```
GET /favorites
```

``` javascript
{
    "data": [
        {
            "id": 680,
            "title": "Pulp Fiction",
            "tagline": "Just because you are a character doesn't mean you have character.",
            "overview": "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
            "popularity": 22.685188,
            "rating": 8.3,
            "ratingCount": 11326,
            "runtime": 154,
            "releaseDate": "1994-09-10",
            "revenue": 213928762,
            "budget": 8000000,
            "posterPath": "/dM2w364MScsjFf8pfMbaWUcWrR.jpg",
            "originalLanguage": "en",
            "genres": [
                {
                    "id": 53,
                    "name": "Thriller"
                },
                {
                    "id": 80,
                    "name": "Crime"
                }
            ],
            "cast": [
                {
                    "id": 8891,
                    "gender": 2,
                    "name": "John Travolta",
                    "character": "Vincent Vega",
                    "profilePath": "/JSt3skdZpGPJYJixCZqH599WdI.jpg"
                },
                {
                    "id": 2231,
                    "gender": 2,
                    "name": "Samuel L. Jackson",
                    "character": "Jules Winfield",
                    "profilePath": "/AvCReLikjzYEf9XjTQxbv3JWgKT.jpg"
                },
                {
                    "id": 139,
                    "gender": 1,
                    "name": "Uma Thurman",
                    "character": "Mia Wallace",
                    "profilePath": "/43DjE9bGtR8z7ejCRvf2tPXPpm1.jpg"
                },
                {
                    "id": 62,
                    "gender": 2,
                    "name": "Bruce Willis",
                    "character": "Butch Coolidge",
                    "profilePath": "/kI1OluWhLJk3pnR19VjOfABpnTY.jpg"
                },
                {
                    "id": 10182,
                    "gender": 2,
                    "name": "Ving Rhames",
                    "character": "Marsellus Wallace",
                    "profilePath": "/8nS83GOu0iqxjL2Oj2DgwkAceFQ.jpg"
                },
                {
                    "id": 1037,
                    "gender": 2,
                    "name": "Harvey Keitel",
                    "character": "Wolf",
                    "profilePath": "/4hci8q0lzZ4vCyItQg2VaA0sc2T.jpg"
                },
                {
                    "id": 7036,
                    "gender": 2,
                    "name": "Eric Stoltz",
                    "character": "Lance",
                    "profilePath": "/fXaULtqnMDKsqT1to8vnLjSXe0w.jpg"
                }
            ]
        },...
		]
}
```

### Add/Remove to favorites

To add/remove favorites, you can use

```
PATCH /favorites
```

with a JSON payload of:

``` javascript
[
	{
		"op": "remove",
		"value": "1893"
	},
	{
		"op": "add",
		"value": "680"
	},
	{
		"op": "add",
		"value": "12"
	}
]
```

where: 

**op** : `add` for adding favorites and `remove` for removing favorites 

**value** : The movieId of the movie you want to add/remove from favorites

Keep in mind that if you start and stop the service, the favorites are lost, they are not stored on disk.

The response will be: (returns the full list of favorites after the add/remove operations)

``` javascript
{
    "data": [
        {
            "id": 680,
            "title": "Pulp Fiction",
            "tagline": "Just because you are a character doesn't mean you have character.",
            "overview": "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
            "popularity": 22.685188,
            "rating": 8.3,
            "ratingCount": 11326,
            "runtime": 154,
            "releaseDate": "1994-09-10",
            "revenue": 213928762,
            "budget": 8000000,
            "posterPath": "/dM2w364MScsjFf8pfMbaWUcWrR.jpg",
            "originalLanguage": "en",
            "genres": [
                {
                    "id": 53,
                    "name": "Thriller"
                },
                {
                    "id": 80,
                    "name": "Crime"
                }
            ],
            "cast": [
                {
                    "id": 8891,
                    "gender": 2,
                    "name": "John Travolta",
                    "character": "Vincent Vega",
                    "profilePath": "/JSt3skdZpGPJYJixCZqH599WdI.jpg"
                },
                {
                    "id": 2231,
                    "gender": 2,
                    "name": "Samuel L. Jackson",
                    "character": "Jules Winfield",
                    "profilePath": "/AvCReLikjzYEf9XjTQxbv3JWgKT.jpg"
                },
                {
                    "id": 139,
                    "gender": 1,
                    "name": "Uma Thurman",
                    "character": "Mia Wallace",
                    "profilePath": "/43DjE9bGtR8z7ejCRvf2tPXPpm1.jpg"
                },
                {
                    "id": 62,
                    "gender": 2,
                    "name": "Bruce Willis",
                    "character": "Butch Coolidge",
                    "profilePath": "/kI1OluWhLJk3pnR19VjOfABpnTY.jpg"
                },
                {
                    "id": 10182,
                    "gender": 2,
                    "name": "Ving Rhames",
                    "character": "Marsellus Wallace",
                    "profilePath": "/8nS83GOu0iqxjL2Oj2DgwkAceFQ.jpg"
                },
                {
                    "id": 1037,
                    "gender": 2,
                    "name": "Harvey Keitel",
                    "character": "Wolf",
                    "profilePath": "/4hci8q0lzZ4vCyItQg2VaA0sc2T.jpg"
                },
                {
                    "id": 7036,
                    "gender": 2,
                    "name": "Eric Stoltz",
                    "character": "Lance",
                    "profilePath": "/fXaULtqnMDKsqT1to8vnLjSXe0w.jpg"
                }
            ]
				},...
		]
}

```

## GraphQL Endpoint

The GraphQL endpoint is already well documented through the use of Graphiql, to access that go to below in your favorite browser:

```
http://localhost:3030/graphiql
```

