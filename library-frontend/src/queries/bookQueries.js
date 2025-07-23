import { gql } from "@apollo/client"
import { AUTHOR_DETAILS } from "./authorQueries"

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    genres
    id
    author {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

export const GET_BOOKS = gql`
  query ($genre: String) {
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
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
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const GET_GENRES = gql`
  query {
    allGenres
  }
`

export const GET_RECOMMENDATIONS = gql`
  query {
    recommendations {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`
