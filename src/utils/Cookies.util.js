import Cookies from "js-cookie";

/**
 * Sets the UUID token that you get back from the server
 * in a session cookie, which means the user is logged in.
 * @param {string} uuid
 */
export const setSessionCookie = (uuid) => {
  Cookies.set("session", uuid, { expires: 1 });
};
/**
 * Gets the UUID token that you stored in a session cookie
 * @returns {string|undefined} session cookie, or undefined if none is set
 */
export const getSessionCookie = () => {
  const sessionCookie = Cookies.get("session");
  if (sessionCookie === undefined) {
    return undefined;
  } else {
    return sessionCookie;
  }
};
/**
 * Deletes a session cookie, which essentially logs out a user
 * @returns void
 */
export const destroySessionCookie = () => {
  Cookies.remove("session");
};
