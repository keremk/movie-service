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
        "limit": 5,
        "total": 16
    },
    "data": [
        {
            "id": 13,
            "title": "Forrest Gump",
            "tagline": "OVERRATED!",
            "overview": "A man with a low IQ has accomplished great things in his life and been present during significant historic events - in each case, far exceeding what anyone imagined he could do. Yet, despite all the things he has attained, his one true love eludes him. 'Forrest Gump' is the story of a man who rose above his challenges, and who proved that determination, courage, and love are more important than ability.",
            "popularity": 23.694098,
            "rating": 8.3,
            "ratingCount": 10742,
            "runtime": 142,
            "releaseDate": "1994-07-06",
            "revenue": 677945399,
            "budget": 55000000,
            "posterPath": "/yE5d3BUhE8hCnkMUJOo1QDoOGNz.jpg",
            "originalLanguage": "en",
            "genres": [
                {
                    "id": 35,
                    "name": "Comedy"
                },
                {
                    "id": 18,
                    "name": "Drama"
                },
                {
                    "id": 10749,
                    "name": "Romance"
                }
            ],
            "cast": [
                {
                    "id": 31,
                    "gender": 2,
                    "name": "Tom Hanks",
                    "character": "Forrest Gump",
                    "profilePath": "/a14CNByTYALAPSGlwlmfHILpEIW.jpg",
                    "profileImage": {
                        "fullPath": "https://image.tmdb.org/t/p/w185/a14CNByTYALAPSGlwlmfHILpEIW.jpg",
                        "size": "w185"
                    }
                }, ...
            ],
            "poster": {
                "fullPath": "https://image.tmdb.org/t/p/w342/yE5d3BUhE8hCnkMUJOo1QDoOGNz.jpg",
                "size": "w342"
            }
        }, ...
    ]
```


### Get list of favorites

To retrieve the list of favorites, you can use

```
GET /favorites?offset=0&limit=2
```

**offset** (Optional): the offset value to start for paging, default is 0 

**limit** (Optional): the number of items per page, default is 100

``` javascript
{
    "metadata": {
        "offset": 0,
        "limit": 2,
        "total": 2
    },
    "data": [
        {
            "id": 1893,
            "title": "Star Wars: Episode I - The Phantom Menace",
            "tagline": "Every generation has a legend. Every journey has a first step. Every saga has a beginning.",
            "overview": "Anakin Skywalker, a young slave strong with the Force, is discovered on Tatooine. Meanwhile, the evil Sith have returned, enacting their plot for revenge against the Jedi.",
            "popularity": 22.71543,
            "rating": 6.4,
            "ratingCount": 6085,
            "runtime": 136,
            "releaseDate": "1999-05-19",
            "revenue": 924317558,
            "budget": 115000000,
            "posterPath": "/n8V09dDc02KsSN6Q4hC2BX6hN8X.jpg",
            "originalLanguage": "en",
            "genres": [
                {
                    "id": 12,
                    "name": "Adventure"
                },
                {
                    "id": 28,
                    "name": "Action"
                },
                {
                    "id": 878,
                    "name": "Science Fiction"
                }
            ],
            "cast": [
                {
                    "id": 3896,
                    "gender": 2,
                    "name": "Liam Neeson",
                    "character": "Qui-Gon Jinn",
                    "profilePath": "/9mdAohLsDu36WaXV2N3SQ388bvz.jpg",
                    "profileImage": {
                        "fullPath": "https://image.tmdb.org/t/p/w185/9mdAohLsDu36WaXV2N3SQ388bvz.jpg",
                        "size": "w185"
                    }
                }, ...
            ],
            "poster": {
                "fullPath": "https://image.tmdb.org/t/p/w342/n8V09dDc02KsSN6Q4hC2BX6hN8X.jpg",
                "size": "w342"
            }
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
{
	"addMovieIds": "1893, 12",
	"removeMovieIds": "680"
}
```

where: 

**addMovieIds** : comma delimited list of movie ids to add to favorites. 

**removeMovieIds** : comma delimited list of movie ids to remove from favorites. 

If the movieId is not a valid movie id, or it already exists, or it is already removed, then it is simply ignored.

Keep in mind that if you start and stop the service, the favorites are lost, they are not stored on disk.

The response will be: (returns the full list of favorites after the add/remove operations)

``` javascript
{
    "metadata": {
        "offset": 0,
        "limit": 2,
        "total": 2
    },
    "data": [
        {
            "id": 1893,
            "title": "Star Wars: Episode I - The Phantom Menace",
            "tagline": "Every generation has a legend. Every journey has a first step. Every saga has a beginning.",
            "overview": "Anakin Skywalker, a young slave strong with the Force, is discovered on Tatooine. Meanwhile, the evil Sith have returned, enacting their plot for revenge against the Jedi.",
            "popularity": 22.71543,
            "rating": 6.4,
            "ratingCount": 6085,
            "runtime": 136,
            "releaseDate": "1999-05-19",
            "revenue": 924317558,
            "budget": 115000000,
            "posterPath": "/n8V09dDc02KsSN6Q4hC2BX6hN8X.jpg",
            "originalLanguage": "en",
            "genres": [
                {
                    "id": 12,
                    "name": "Adventure"
                },
                {
                    "id": 28,
                    "name": "Action"
                },
                {
                    "id": 878,
                    "name": "Science Fiction"
                }
            ],
            "cast": [
                {
                    "id": 3896,
                    "gender": 2,
                    "name": "Liam Neeson",
                    "character": "Qui-Gon Jinn",
                    "profilePath": "/9mdAohLsDu36WaXV2N3SQ388bvz.jpg",
                    "profileImage": {
                        "fullPath": "https://image.tmdb.org/t/p/w185/9mdAohLsDu36WaXV2N3SQ388bvz.jpg",
                        "size": "w185"
                    }
                }, ...
            ],
            "poster": {
                "fullPath": "https://image.tmdb.org/t/p/w342/n8V09dDc02KsSN6Q4hC2BX6hN8X.jpg",
                "size": "w342"
            }
        },...
    ]
}
```

## GraphQL Endpoint

The GraphQL endpoint is already well documented through the use of Graphiql, to access that go to below in your favorite browser:

```
http://localhost:4000/graphql
```

