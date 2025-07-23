import { useEffect, useState } from "react"
import { Route, Routes } from "react-router"
import { useApolloClient, useSubscription } from "@apollo/client"

import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Menu from "./components/Menu"
import Home from "./components/Home"
import LoginForm from "./components/LoginForm"
import Recommended from "./components/Recommended"

import { BOOK_ADDED, GET_BOOKS } from "./queries/bookQueries"

const App = () => {
  const [token, setToken] = useState()
  const client = useApolloClient()

  useEffect(() => {
    const tokenInBrowser = localStorage.getItem("library-app-user-token")

    if (tokenInBrowser) {
      setToken(tokenInBrowser)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data)
      const addedBook = data.data.bookAdded
      window.alert(`Book ${addedBook.title} added to list`)

      client.cache.updateQuery({ query: GET_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook),
        }
      })
    },
  })

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem("library-app-user-token")
    client.resetStore()
  }

  return (
    <div>
      <div>
        <Menu token={token} handleLogout={handleLogout} />
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/new" element={<NewBook />} />
          <Route
            path="/recommendations"
            element={<Recommended token={token} />}
          />
          <Route path="/login" element={<LoginForm setToken={setToken} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
