import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author
      genres
      id
    }
  }
`

export const NEW_BOOK = gql`
  mutation newBook(
    $title: String!,
    $author: String!,
    $published: Int!,
    $genres: [String!]!
  ) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
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