// GraphQL schema definition
const { gql } = require('apollo-server-express')

const typeDefs = gql`
  type Query { 
    allMovies(genre: String, rating: Float, offset: Int, limit: Int): MovieCollection! 
    genres: [Genre!]
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
  type Genre {
    id: Int!,
    name: String!
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
    genres: [Genre!]
    cast: [Actor!] 
  }
`;

module.exports = typeDefs;
