import React, { useEffect, useState, useContext } from "react";
import { CookieContext } from "../Context/SessionContext";
import axios from "axios";
import { Link } from "react-router-dom";

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
    /**
     * The API should not give you back any books unless you are logged in.
     * To prove that you are logged in, you must pass the token (UUID) in the API.
     */
    if (shelfChangeUri !== "")
      axios
        // for some reason this request didn't work with params like above get
        // request so I just tacked query string onto the uri
        .put(`http://localhost:7000/bookshelf${shelfChangeUri}?id=${uuid}`)
        .then((resp) => resp.data.books && setBooks(resp.data.books))
        .catch((err) => {
          console.error(err);
          setErrorMessage("Oh no! An unexpected error occurred.");
        });
  }, [shelfChangeUri]);

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
      <h1 className="h2">Your Bookshelf</h1>
      <h2>Want To Read</h2>
      {/* Checking if books contains anything- we don't want to get an error for trying 
      to render something that doesn't exist from the initialized empty books array*/}
      {books.wantToRead &&
        books.wantToRead.map((book) => {
          const id = `book-${book.id}`;
          return (
            <div key={id}>
              <Link to={`/book/${book.id}`}>{book.title}</Link>
              {book.imageLinks && (
                <Link to={`/book/${book.id}`}>
                  <img src={book.imageLinks.thumbnail} alt={book.title} />
                </Link>
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
                <option value="none">Remove</option>
              </select>
            </div>
          );
        })}
      <h2>Currently Reading</h2>
      {books.currentlyReading &&
        books.currentlyReading.map((book) => {
          const id = `book-${book.id}`;
          return (
            <div key={id}>
              <Link to={`/book/${book.id}`}>{book.title}</Link>
              {book.imageLinks && (
                <Link to={`/book/${book.id}`}>
                  <img src={book.imageLinks.thumbnail} alt={book.title} />
                </Link>
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
                <option value="none">Remove</option>
              </select>
            </div>
          );
        })}
      <h2>Read</h2>
      {books.read &&
        books.read.map((book) => {
          const id = `book-${book.id}`;
          return (
            <div key={id}>
              <Link to={`/book/${book.id}`}>{book.title}</Link>
              {book.imageLinks && (
                <Link to={`/book/${book.id}`}>
                  <img src={book.imageLinks.thumbnail} alt={book.title} />
                </Link>
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
                <option value="none">Remove</option>
              </select>
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
