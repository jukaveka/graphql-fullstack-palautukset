import { useState } from "react"

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (event) => {
    event.preventDefault()

    console.log(username, password)
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
