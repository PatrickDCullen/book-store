import React, { useState, createContext } from "react";
import {
  getSessionCookie,
  setSessionCookie,
  destroySessionCookie,
} from "../utils/Cookies.util";

export const CookieContext = createContext();

export const CookieProvider = ({ children }) => {
  const [uuid, setUUID] = useState(getSessionCookie());

  const set = (newUUID) => {
    /**
     * Store the UUID in a session cookie so that it will still be there if the refreshes the page.
     */
    newUUID ? setSessionCookie(newUUID) : destroySessionCookie();
    /**
     * Making the app rerender and storing the UUID in context
     * so that APIs that need to include the UUID will have it.
     */
    setUUID(newUUID);
  };

  return (
    <CookieContext.Provider value={[uuid, set]}>
      {children}
    </CookieContext.Provider>
  );
};
