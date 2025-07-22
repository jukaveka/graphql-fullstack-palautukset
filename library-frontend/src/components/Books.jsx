import { useQuery, useApolloClient } from "@apollo/client"
import { GET_BOOKS, GET_GENRES } from "../queries/bookQueries"
import { useState } from "react"

const Books = () => {
  const [genre, setGenre] = useState("All")
  const client = useApolloClient()

  const booksResult = useQuery(GET_BOOKS, {
    variables: { genre: genre === "All" ? undefined : genre },
  })

  const genresResult = useQuery(GET_GENRES)

  if (booksResult.loading) {
    return <div> Loading book data</div>
  }

  if (booksResult.error) {
    return <div> There was an issue with fetching books from server</div>
  }

  const books = booksResult.data.allBooks
  const genres = genresResult.data.allGenres

  const handleGenreChange = async (event) => {
    setGenre(event.target.value)
    client.refetchQueries({
      include: [GET_BOOKS],
    })
  }

  return (
    <div>
      <h2>books</h2>

      <h4> View by genre </h4>
      <select value={genre} onChange={handleGenreChange}>
        <option key="all-genres" value="All">
          All
        </option>
        {genres.map((genre, index) => {
          return (
            <option key={`genre-option-${index}`} value={genre}>
              {genre}
            </option>
          )
        })}
      </select>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
