import { useQuery } from "@apollo/client"
import { GET_BOOKS } from "../queries/bookQueries"

const Books = () => {
  const result = useQuery(GET_BOOKS)

  if (result.loading) {
    return <div> Loading book data</div>
  }

  if (result.error) {
    return <div> There was an issue with fetching books from server</div>
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>

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
