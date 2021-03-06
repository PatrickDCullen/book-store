import React, { useEffect, useState, Fragment, useContext } from "react";
import { CookieContext } from "../Context/SessionContext";
import axios from "axios";
import { Nav, NavLink, Media } from "reactstrap";

export const BookDetail = ({ history }) => {
  const [book, setBook] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const bookIdUri = history.location.pathname;
  const [shelfChangeUri, setShelfChangeUri] = useState("");
  /**
   * Getting the token (UUID) we stored in the Context API.
   */
  const [uuid, setUUID] = useContext(CookieContext);

  useEffect(() => {
    /**
     * The API should not give you back any book details unless you are logged in.
     * To prove that you are logged in, you must pass the token (UUID) in the API.
     */
    axios
      .get(`http://localhost:7000${bookIdUri}`, {
        params: {
          id: uuid,
        },
      })
      .then((resp) => setBook(resp.data.book))
      .catch((err) => {
        console.error(err);
        setErrorMessage("Oh no! An unexpected error occurred.");
      });
  }, [uuid, bookIdUri, shelfChangeUri]);

  useEffect(() => {
    /**
     * The API should not give you back any books unless you are logged in.
     * To prove that you are logged in, you must pass the token (UUID) in the API.
     */
    if (shelfChangeUri !== "")
      axios
        .put(`http://localhost:7000/bookshelf${shelfChangeUri}?id=${uuid}`)
        .catch((err) => {
          console.error(err);
          setErrorMessage("Oh no! An unexpected error occurred.");
        });
  }, [shelfChangeUri]);

  return (
    <div className="container mt-2 mb-5">
      <div className="d-flex justify-content-between mb-2">
        <Nav>
          <NavLink href="/bookshelf">Bookshelf</NavLink>
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
      {book && (
        <Fragment>
          <h2 className="mb-2">{book.title}</h2>
          <Media>
            <Media left>
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
              {book.authors &&
                book.authors.map((author, index) => {
                  return (
                    <p key={index} className="Authors">
                      {author}
                    </p>
                  );
                })}
              {book.description && <p>{book.description}</p>}
              {book.publisher && <p>{book.publisher}</p>}
              {book.publishedDate && <p>Published on {book.publishedDate}</p>}
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
        </Fragment>
      )}
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
