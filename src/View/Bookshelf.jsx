import React, { useEffect, useState, useContext } from "react";
import { CookieContext } from "../Context/SessionContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { Nav, NavLink, Media } from "reactstrap";

export const Bookshelf = ({ history }) => {
  const [books, setBooks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [shelfChangeUri, setShelfChangeUri] = useState("");
  /**
   * Getting the token (UUID) we stored in the Context API.
   */
  const [uuid, setUUID] = useContext(CookieContext);

  useEffect(() => {
    /**
     * The API should not give you back any books unless you are logged in.
     * To prove that you are logged in, you must pass the token (UUID) in the API.
     */
    axios
      .get("http://localhost:7000/bookshelf", {
        params: {
          id: uuid,
        },
      })
      .then((resp) => resp.data.books && setBooks(resp.data.books))
      .catch((err) => {
        console.error(err);
        setErrorMessage("Oh no! An unexpected error occurred.");
      });
  }, []);

  useEffect(() => {
    if (shelfChangeUri !== "")
      axios
        .put(`http://localhost:7000/bookshelf${shelfChangeUri}?id=${uuid}`)
        .then((resp) => resp.data.books && setBooks(resp.data.books))
        .catch((err) => {
          console.error(err);
          setErrorMessage("Oh no! An unexpected error occurred.");
        });
  }, [shelfChangeUri]);

  return (
    <div className="container mb-5 pt-2">
      <div className="d-flex justify-content-between mb-2">
        <Nav>
          <NavLink disabled href="/bookshelf">
            Bookshelf
          </NavLink>
          <NavLink href="/search"> Search</NavLink>
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
      <h2>Want To Read</h2>
      {books.wantToRead &&
        books.wantToRead.map((book) => {
          const id = `book-${book.id}`;
          return (
            <div key={id}>
              <Media>
                <Media left href={`/book/${book.id}`}>
                  {book.imageLinks && (
                    <Media
                      object
                      src={book.imageLinks.thumbnail}
                      alt="thumbnail image of book's cover"
                      className="mb-2 mr-2"
                    />
                  )}
                  {!book.imageLinks && (
                    <Media
                      object
                      src="https://via.placeholder.com/128x168"
                      alt="thumbnail image of book's cover"
                      className="mb-2 mr-2"
                    />
                  )}
                </Media>
                <Media body>
                  {book.title && (
                    <h2>
                      <Link to={`/book/${book.id}`}>{book.title}</Link>
                    </h2>
                  )}

                  <label htmlFor="shelf">Change shelf:</label>
                  <select
                    id="shelf"
                    name="shelf"
                    className="form-control"
                    value={book.shelf}
                    onChange={(e) =>
                      setShelfChangeUri(`/${book.id}/${e.target.value}`)
                    }
                  >
                    <option value="wantToRead">Want To Read</option>
                    <option value="currentlyReading">Currently Reading</option>
                    <option value="read">Read</option>
                    <option value="none">None</option>
                  </select>
                </Media>
              </Media>
            </div>
          );
        })}
      <h2>Currently Reading</h2>
      {books.currentlyReading &&
        books.currentlyReading.map((book) => {
          const id = `book-${book.id}`;
          return (
            <div key={id}>
              <Media>
                <Media left href={`/book/${book.id}`}>
                  {book.imageLinks && (
                    <Media
                      object
                      src={book.imageLinks.thumbnail}
                      alt="thumbnail image of book's cover"
                      className="mb-2 mr-2"
                    />
                  )}
                  {!book.imageLinks && (
                    <Media
                      object
                      src="https://via.placeholder.com/128x168"
                      alt="thumbnail image of book's cover"
                      className="mb-2 mr-2"
                    />
                  )}
                </Media>
                <Media body>
                  {book.title && (
                    <h2>
                      <Link to={`/book/${book.id}`}>{book.title}</Link>
                    </h2>
                  )}

                  <label htmlFor="shelf">Change shelf:</label>
                  <select
                    id="shelf"
                    name="shelf"
                    className="form-control"
                    value={book.shelf}
                    onChange={(e) =>
                      setShelfChangeUri(`/${book.id}/${e.target.value}`)
                    }
                  >
                    <option value="wantToRead">Want To Read</option>
                    <option value="currentlyReading">Currently Reading</option>
                    <option value="read">Read</option>
                    <option value="none">None</option>
                  </select>
                </Media>
              </Media>
            </div>
          );
        })}
      <h2>Read</h2>
      {books.read &&
        books.read.map((book) => {
          const id = `book-${book.id}`;
          return (
            <div key={id}>
              <Media>
                <Media left href={`/book/${book.id}`}>
                  {book.imageLinks && (
                    <Media
                      object
                      src={book.imageLinks.thumbnail}
                      alt="thumbnail image of book's cover"
                      className="mb-2 mr-2"
                    />
                  )}
                  {!book.imageLinks && (
                    <Media
                      object
                      src="https://via.placeholder.com/128x168"
                      alt="thumbnail image of book's cover"
                      className="mb-2 mr-2"
                    />
                  )}
                </Media>
                <Media body>
                  {book.title && (
                    <h2>
                      <Link to={`/book/${book.id}`}>{book.title}</Link>
                    </h2>
                  )}

                  <label htmlFor="shelf">Change shelf:</label>
                  <select
                    id="shelf"
                    name="shelf"
                    className="form-control"
                    value={book.shelf}
                    onChange={(e) =>
                      setShelfChangeUri(`/${book.id}/${e.target.value}`)
                    }
                  >
                    <option value="wantToRead">Want To Read</option>
                    <option value="currentlyReading">Currently Reading</option>
                    <option value="read">Read</option>
                    <option value="none">None</option>
                  </select>
                </Media>
              </Media>
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
