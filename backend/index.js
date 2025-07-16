import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { v4 as uuid } from "uuid"
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
    bookCount: Int
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
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
  }
`

const resolvers = {
  Query: {
    authorCount: () => authors.length,
    bookCount: () => books.length,

    allBooks: (root, args) => {
      if (!args.author && !args.genre) {
        return books
      }

      let filteredBooks = books

      if (args.author) {
        filteredBooks = filteredBooks.filter(book => book.author === args.author)
      }

      if (args.genre) {
        filteredBooks = filteredBooks.filter(book => book.genres.includes(args.genre))
      }

      return filteredBooks
    },

    allAuthors: () => authors
  },

  Author: {
    bookCount: (root) => books.filter(book => book.author === root.name).length
  },

  Mutation: {
    addBook: (root, args) => {
      const newBook = { ...args, id: uuid()}

      const authorNames = authors.map(author => author.name)
      if (!authorNames.includes(newBook.author)) {
        const newAuthor = { name: newBook.author }
        authors = authors.concat(newAuthor)
      }

      books = books.concat(newBook)
      return newBook
    }
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
