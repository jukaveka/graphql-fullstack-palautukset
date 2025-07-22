import { gql } from "@apollo/client"

export const GET_BOOKS = gql`
  query ($genre: String) {
    allBooks(genre: $genre) {
      title
      published
      genres
      id
      author {
        name
        born
        bookCount
        id
      }
    }
  }
`

export const NEW_BOOK = gql`
  mutation newBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author
      published
      genres
      id
    }
  }
`

export const GET_GENRES = gql`
  query {
    allGenres
  }
`
