import { useMutation } from "@apollo/client"
import { useState } from "react"
import { GET_BOOKS, NEW_BOOK } from "../queries/bookQueries"
import { GET_AUTHORS } from "../queries/authorQueries"

const NewBook = () => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [published, setPublished] = useState("")
  const [genre, setGenre] = useState("")
  const [genres, setGenres] = useState([])

  const [newBook] = useMutation(NEW_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }, { query: GET_AUTHORS }],
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
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre("")
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
