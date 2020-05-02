import React, { useContext, Fragment } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import { CookieContext } from "../Context/SessionContext";
import { Nav, NavLink } from "reactstrap";

/**
 * This will redirect the user to the login form if they haven't logged in.
 * @param {Object} props
 * {
 *   component: Bookshelf, // e.g. <Bookshelf /> component
 *   foo: "bar"
 * }
 */
export const ProtectedRoute = ({
  component: Component, // Capitalizing because React requires components names to be capitalized
  ...restOfPropsFromParent
}) => {
  /**
   * If the user is logged in, the UUID token will be stored in the Context API.
   */
  const [uuid] = useContext(CookieContext);

  return (
    <Fragment>
      <Route
        {...restOfPropsFromParent}
        render={(propsFromReactRouter) => {
          return uuid ? (
            /**
             * If the user is logged in, return the child component with the props from React Router.
             */
            <Component {...propsFromReactRouter} />
          ) : (
            /**
             * If the user isn't logged in, redirect to the login form, which in this example, is "/".
             */
            <Redirect
              to="/"
              {...propsFromReactRouter}
              {...restOfPropsFromParent}
            />
          );
        }}
      />
    </Fragment>
  );
};
