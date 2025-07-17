import { gql } from "@apollo/client";

export const GET_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`;

export const UPDATE_AUTHOR_BORN = gql`
  mutation updateAuthorBorn($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
      bookCount
      id
    }
  }
`;
