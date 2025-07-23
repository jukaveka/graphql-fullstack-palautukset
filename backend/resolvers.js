const { PubSub } = require("graphql-subscriptions")
const pubSub = new PubSub()
const { GraphQLError } = require("graphql")
const jwt = require("jsonwebtoken")

const Author = require("./models/AuthorModel")
const Book = require("./models/BookModel")
const User = require("./models/UserModel")

const resolvers = {
  Query: {
    authorCount: () => Author.collection.countDocuments(),
    bookCount: () => Book.collection.countDocuments(),
    me: (root, args, context) => context.currentUser,
    allAuthors: async () => Author.find({}),

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

    allGenres: async (root, args) => {
      const books = await Book.find({})

      const genres = books.map((book) => book.genres).flat(1)
      const genreSet = new Set(genres)

      return Array.from(genreSet)
    },

    recommendations: async (root, args, context) => {
      const user = context.currentUser

      return Book.find({ genres: user.favoriteGenre }).populate("author")
    },
  },

  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root.id })
      return books.length
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError("Authentication required", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }

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

      pubSub.publish("BOOK_ADDED", { bookAdded: book.populate("author") })

      return book.populate("author")
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError("Authentication required", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }

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
      const user = new User({ ...args })

      return user.save().catch((error) => {
        throw new GraphQLError("Error while saving new user", {
          code: "BAD_USER_INPUT",
          error,
        })
      })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== "salasana") {
        throw new GraphQLError("Wrong username or password", {
          code: "BAD_USER_INPUT",
        })
      }

      const tokenUser = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(tokenUser, process.env.JWT_SECRET) }
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubSub.asyncIterableIterator("BOOK_ADDED"),
    },
  },
}

module.exports = resolvers
