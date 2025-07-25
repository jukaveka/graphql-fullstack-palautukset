import { useState } from "react"
import { GET_AUTHORS, UPDATE_AUTHOR_BORN } from "../queries/authorQueries"
import { useMutation } from "@apollo/client"

const AuthorForm = ({ authors }) => {
  const [name, setName] = useState("Choose")
  const [born, setBorn] = useState("")

  const [updateAuthorBorn] = useMutation(UPDATE_AUTHOR_BORN, {
    refetchQueries: [{ query: GET_AUTHORS }],
  })

  const handleAuthorForm = (event) => {
    event.preventDefault()

    updateAuthorBorn({ variables: { name, born: parseInt(born) } })

    setName("None")
    setBorn("")
  }

  return (
    <div>
      <div>
        <h3> Change author year of birth </h3>
      </div>
      <form onSubmit={handleAuthorForm}>
        <div>
          <label htmlFor="author-name-input"> Author </label>
          <select value={name} onChange={({ target }) => setName(target.value)}>
            <option key="no-chosen-author" value="Choose">
              Choose
            </option>
            {authors.map((author, index) => {
              return (
                <option key={`option-${index}`} value={author.name}>
                  {author.name}
                </option>
              )
            })}
          </select>
        </div>
        <div>
          <label htmlFor="author-name-input"> Born at </label>
          <input
            type="text"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <div>
          <button type="submit"> Change </button>
        </div>
      </form>
    </div>
  )
}

export default AuthorForm
