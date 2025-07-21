import { useEffect, useState } from "react"
import { Route, Routes } from "react-router"
import { useApolloClient } from "@apollo/client"

import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Menu from "./components/Menu"
import Home from "./components/Home"
import LoginForm from "./components/LoginForm"

const App = () => {
  const [token, setToken] = useState()
  const client = useApolloClient()

  useEffect(() => {
    const tokenInBrowser = localStorage.getItem("library-app-user-token")

    if (tokenInBrowser) {
      setToken(tokenInBrowser)
    }
  }, [])

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
          <Route path="/login" element={<LoginForm setToken={setToken} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
