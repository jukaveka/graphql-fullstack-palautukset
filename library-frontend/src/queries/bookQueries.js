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