import { Link } from "react-router"

const Menu = ({ token, handleLogout }) => {
  return (
    <div>
      <Link to="/">
        <button> Home </button>
      </Link>
      <Link to="/authors">
        <button> Authors </button>
      </Link>
      <Link to="/books">
        <button> Books </button>
      </Link>
      {!token && (
        <Link to="/login">
          <button> Login </button>
        </Link>
      )}
      {token && (
        <>
          <Link to="/books/new">
            <button> New </button>
          </Link>
          <Link to="/recommendations">
            <button> For you </button>
          </Link>
          <Link to="/">
            <button onClick={handleLogout}> Logout </button>
          </Link>
        </>
      )}
    </div>
  )
}

export default Menu
