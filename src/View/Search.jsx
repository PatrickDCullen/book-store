import React, { useEffect, useState, useContext } from "react";
import { CookieContext } from "../Context/SessionContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { Nav, NavLink, Media } from "reactstrap";

export const Search = ({ history }) => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const [errorMessage, setErrorMessage] = useState("");
  /**
   * Getting the token (UUID) we stored in the Context API.
   */
  const [uuid, setUUID] = useContext(CookieContext);

  useEffect(() => {
    /**
     * The API should not give you back any books unless you are logged in.
     * To prove that you are logged in, you must pass the token (UUID) in the API.
     */
    // Put in the conditional because otherwise it throws an error on initial
    // page load because you are rendering the request to a uri that doesn't exist.
    if (searchTerm !== "") {
      axios
        .get(
          `http://localhost:7000/book/search/${searchTerm
            .split(" ")
            .join("+")}`,
          {
            params: {
              id: uuid,
            },
          }
        )
        .then((resp) => setBooks(resp.data))
        .catch((err) => {
          console.error(err);
          setErrorMessage("Oh no! An unexpected error occurred.");
        });
    }
  }, [uuid, searchTerm]);

  return (
    <div className="container mt-2 mb-5">
      <div className="d-flex justify-content-between mb-2">
        <Nav>
          <NavLink href="/bookshelf">Bookshelf</NavLink>
          <NavLink disabled href="/search">
            {" "}
            Search
          </NavLink>
        </Nav>
        <button
          className="btn btn-primary"
          onClick={() => {
            setUUID();
            history.push("/");
          }}
        >
          Logout
        </button>
      </div>
      <form className="mb-2">
        <input
          id="Search"
          name="Search"
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search for books by title"
        />
      </form>
      <h2>Results</h2>
      {books.message &&
        books.message.substring(0, 17) === "No books matching" && (
          <p>There are no books matching your request.</p>
        )}
      {books.books &&
        books.books.map((book) => {
          const id = `book-${book.id}`;
          return (
            <Media>
              <Media left href={`/book/${book.id}`}>
                {book.imageLinks && (
                  <Media
                    object
                    src={book.imageLinks.thumbnail}
                    alt="the thumbnail didn't render"
                    className="mb-2 mr-2"
                  />
                )}
              </Media>
              <Media body>
                <Link to={`/book/${book.id}`}>
                  <Media heading>{book.title}</Media>
                </Link>
                {book.authors &&
                  book.authors.map((author) => {
                    return <p>{author}</p>;
                  })}
              </Media>
            </Media>
          );
        })}

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
