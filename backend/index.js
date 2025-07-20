require("dotenv").config()
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)

const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const { GraphQLError } = require("graphql")

const Author = require("./models/AuthorModel")
const Book = require("./models/BookModel")
const User = require("./models/UserModel")

const MONGODB_URI = process.env.MONGODB_URI
console.log("Connecting to database", MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to database")
  })
  .catch((error) => {
    console.log("Couldn't connect to database")
    console.log(error.message)
  })

const typeDefs = `
  type Author {
    name: String!
    born: Int
    bookCount: Int
    id: ID! 
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    authorCount: () => Author.collection.countDocuments(),
    bookCount: () => Book.collection.countDocuments(),

    allBooks: async (root, args) => {
      const books = await Book.find({}).populate("author")
      if (!args.author && !args.genre) {
        return books
      }

      let filteredBooks = books

      if (args.author) {
        filteredBooks = filteredBooks.filter(
          (book) => book.author.name === args.author
        )
      }

      if (args.genre) {
        filteredBooks = filteredBooks.filter((book) =>
          book.genres.includes(args.genre)
        )
      }

      return filteredBooks
    },

    allAuthors: async () => Author.find({}),
  },

  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root.id })
      return books.length
    },
  },

  Mutation: {
    addBook: async (root, args) => {
      const authorInDb = await Author.findOne({ name: args.author })
      if (!authorInDb) {
        const newAuthor = new Author({ name: args.author })

        try {
          await newAuthor.save()
        } catch (error) {
          throw new GraphQLError("Error faced while saving new author", {
            code: "BAD_USER_INPUT",
            invalidArgs: args.author,
            error,
          })
        }
      }

      const author = await Author.findOne({ name: args.author })

      const book = new Book({ ...args, author: author.id })

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError("Error while saving new book", {
          code: "BAD_USER_INPUT",
          error,
        })
      }

      return book.populate("author")
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo
      return author.save().catch((error) => {
        throw new GraphQLError("Error while saving edited author", {
          code: "BAD_USER_INPUT",
          error,
        })
      })
    },

    createUser: async (root, args) => {
      console.log(args)
      const user = new User({ ...args })

      return user.save().catch((error) => {
        throw new GraphQLError("Error while saving new user", {
          code: "BAD_USER_INPUT",
          error,
        })
      })
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
