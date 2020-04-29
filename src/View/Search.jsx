import React, { useEffect, useState, useContext } from "react";
import { CookieContext } from "../Context/SessionContext";
import axios from "axios";
import { Link } from "react-router-dom";

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
      <div className="d-flex justify-content-between">
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
      <form>
        <label>Search for books by title:</label>
        <input
          id="Search"
          name="Search"
          type="text"
          value={searchTerm}
          onChange={handleChange}
        />
      </form>
      <h2>Results</h2>
      {/* is there a better way of checking for no match? Would using books.hasownproperty(message) be easier to read?  More declarative? */}
      {typeof books.message !== "undefined" &&
        books.message.substring(0, 17) === "No books matching" && (
          <p>There are no books matching your request.</p>
        )}
      {typeof books.books !== "undefined" &&
        books.books.map((book) => {
          const id = `book-${book.id}`;
          // Is there a good way to conditionally define thumbnail constant? Is
          // it even worth it in this case where you are creating a variable and
          // only using it once? (I lean towards no in this use case)
          //const title = `${book.title}`;
          // const thumbnail = `${book.imageLinks.smallThumbnail}`;
          return (
            <div key={id}>
              {/* Here we are technically assuming title exists. Bad practice? */}
              <Link to={`/book/${book.id}`}>{book.title}</Link>
              {typeof book.imageLinks !== "undefined" && (
                <Link to={`/book/${book.id}`}>
                  <img src={book.imageLinks.thumbnail} alt={book.title} />
                </Link>
              )}
              {/* How can I test to ensure that conditional rendering works? i.e. is there a good way to see what the
              data looks like when there is no author? Is there a way to tell whether it will be an empty array or just missing? */}
              {typeof book.authors[0] !== "undefined" &&
                book.authors.map((author) => {
                  return <p>{author}</p>;
                })}
            </div>
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
