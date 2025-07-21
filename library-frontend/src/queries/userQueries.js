import { gql } from "@apollo/client"

export const LOGIN = gql`
  mutation loginAttempt($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
