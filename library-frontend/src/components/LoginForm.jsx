import { useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import { LOGIN } from "../queries/userQueries"
import { useNavigate } from "react-router"

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.message)
    },
  })

  useEffect(() => {
    if (result.data) {
      console.log(result.data.login)
      const token = result.data.login.value
      console.log("Token", token)
      setToken(token)
      localStorage.setItem("library-app-user-token", token)
    }
  }, [result.data])

  const handleLogin = (event) => {
    event.preventDefault()

    login({ variables: { username, password } })

    navigate("/")
  }
  return (
    <div>
      <h3> Login </h3>
      <form onSubmit={handleLogin}>
        <div>
          <label> Username </label>
          <br />
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <br />
        <div>
          <label> Password </label>
          <br />
          <input
            type="text"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <br />
        <button> Login </button>
      </form>
    </div>
  )
}

export default LoginForm
