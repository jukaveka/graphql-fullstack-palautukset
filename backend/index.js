import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import data from "./data.js"

let authors = data.authors
let books = data.books

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
  type Author {
    name: String!
    born: Int
    id: ID! 
  }

  type Book {
    title: String!,
    published: Int!,
    author: String!,
    genres: [String!]!,
    id: ID!
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
  }
`

const resolvers = {
  Query: {

  authorCount: () => authors.length,
  bookCount: () => books.length
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
})
