import { useMutation } from "@apollo/client"
import { useState } from "react"
import { useNavigate } from "react-router"

import { GET_BOOKS, GET_GENRES, NEW_BOOK } from "../queries/bookQueries"
import { GET_AUTHORS } from "../queries/authorQueries"

const NewBook = () => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [published, setPublished] = useState("")
  const [genre, setGenre] = useState("")
  const [genres, setGenres] = useState([])
  const navigate = useNavigate()

  const [newBook] = useMutation(NEW_BOOK, {
    refetchQueries: [
      { query: GET_BOOKS },
      { query: GET_AUTHORS },
      { query: GET_GENRES },
    ],
  })

  const submit = async (event) => {
    event.preventDefault()

    const publishedInt = parseInt(published)

    newBook({ variables: { title, author, published: publishedInt, genres } })

    setTitle("")
    setPublished("")
    setAuthor("")
    setGenres([])
    setGenre("")

    navigate("/books")
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre("")
  }

  return (
    <div>
      <h3> Add new book </h3>
      <form onSubmit={submit}>
        <div>
          <label> Title </label>
          <br />
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <br />
        <div>
          <label> Author </label>
          <br />
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <br />
        <div>
          <label> Published </label>
          <br />
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <br />
        <div>
          <label> Add genres </label>
          <br />
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <br />
        <div>Genres : {genres.join(", ")}</div>
        <br />
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
