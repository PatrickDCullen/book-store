import React, { useEffect, useState, Fragment, useContext } from "react";
import { CookieContext } from "../Context/SessionContext";
import axios from "axios";

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
    // you have to get the book id from somewhere... you have to store it first.
    // Seems like a good job for context
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
        // for some reason this request didn't work with params like above get
        // request so I just tacked query string onto the uri
        .put(`http://localhost:7000/bookshelf${shelfChangeUri}?id=${uuid}`)
        // .then((resp) => resp.data.books && setBook(resp.data.book))
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
      <h2>Book Details</h2>
      {/* Checking if books contains anything- we don't want to get an error for trying 
      to render something that doesn't exist from the initialized empty books array*/}
      {book && (
        <Fragment>
          <p>{book.title}</p>
          {book.imageLinks && (
            <img src={book.imageLinks.thumbnail} alt={book.title} />
          )}
          {book.authors &&
            book.authors.map((author, index) => {
              return <p key={index}>{author}</p>;
            })}
          {book.description && <p>{book.description}</p>}
          {book.publisher && <p>{book.publisher}</p>}
          {book.publishedDate && <p>Published on {book.publishedDate}</p>}
          {/* eventually want an object to associate shelf variable name and shelf in english i.e. 
          {currentlyReading : "currently reading"} */}
          {/*  */}
          <label htmlFor="shelf">Change shelf:</label>
          <select
            id="shelf"
            name="shelf"
            className="form-control"
            value={book.shelf}
            onChange={(e) => setShelfChangeUri(`/${book.id}/${e.target.value}`)}
          >
            <option value="wantToRead">Want To Read</option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="read">Read</option>
            <option value="none">None</option>
          </select>
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
