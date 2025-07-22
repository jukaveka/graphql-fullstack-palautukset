require("dotenv").config()
const express = require("express")
const cors = require("cors")
const http = require("http")

const { ApolloServer } = require("@apollo/server")
const { expressMiddleware } = require("@apollo/server/express4")
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer")
const { makeExecutableSchema } = require("@graphql-tools/schema")

const { WebSocketServer, WebSocketServer } = require("ws")
const { useServer } = require("graphql-ws/lib/use/ws")

const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)

const resolvers = require("./resolvers")
const typeDefs = require("./schema")

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

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null

        if (auth && auth.startsWith("Bearer ")) {
          const decodedToken = jwt.verify(
            auth.substring(7),
            process.env.JWT_SECRET
          )

          const currentUser = await User.findById(decodedToken.id)

          return { currentUser }
        }
      },
    })
  )

  const PORT = 4000

  httpServer.listen(PORT, () => {
    console.log(`Server is running and available in http://localhost:${PORT}`)
  })
}

start()
