import { Route, Routes } from "react-router"

import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Menu from "./components/Menu"
import Home from "./components/Home"

const App = () => {
  return (
    <div>
      <div>
        <Menu />
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/new" element={<NewBook />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
