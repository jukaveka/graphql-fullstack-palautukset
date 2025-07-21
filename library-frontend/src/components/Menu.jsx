import { Link } from "react-router"

const Menu = () => {
  return (
    <div>
      <Link to="/">
        {" "}
        <button> Home </button>
      </Link>
      <Link to="/authors">
        {" "}
        <button> Authors </button>{" "}
      </Link>
      <Link to="/books">
        {" "}
        <button> Books </button>{" "}
      </Link>
      <Link to="/books/new">
        {" "}
        <button> New </button>{" "}
      </Link>
    </div>
  )
}

export default Menu
