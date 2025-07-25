import { useQuery } from "@apollo/client"
import { GET_AUTHORS } from "../queries/authorQueries"
import AuthorForm from "./AuthorForm"

const Authors = ({ token }) => {
  const result = useQuery(GET_AUTHORS)

  if (result.loading) {
    return <div> Loading author data</div>
  }

  if (result.error) {
    return (
      <div>
        There was an issue with fetching authors from server -
        {result.error.message}
      </div>
    )
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {token && <AuthorForm authors={authors} />}
    </div>
  )
}

export default Authors
