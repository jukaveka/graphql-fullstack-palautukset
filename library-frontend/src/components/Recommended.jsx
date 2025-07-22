import { useQuery } from "@apollo/client"
import { GET_RECOMMENDATIONS } from "../queries/bookQueries"

const Recommended = ({ token }) => {
  const result = useQuery(GET_RECOMMENDATIONS)

  if (result.loading) {
    return <div> Loading book recommendations</div>
  }

  if (result.error) {
    return (
      <div>
        <div> There was an issue with fetching recommendations from server</div>
        <div> {result.error.message} </div>
      </div>
    )
  }

  const recommendations = result.data.recommendations

  return (
    <div>
      <h3> Recommendations for you</h3>
      <h5> List of books that match with your tastes </h5>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendations.map((book) => (
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

export default Recommended
