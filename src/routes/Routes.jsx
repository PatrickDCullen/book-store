import React from "react";
import App from "../App";
import { Route, Switch } from "react-router-dom";
import { Bookshelf } from "../View/Bookshelf";
import { BookDetail } from "../View/BookDetail";
import { Search } from "../View/Search";
import { CookieProvider } from "../Context/SessionContext";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const Routes = () => {
  return (
    <CookieProvider>
      <Switch>
        {/* Using route for what the user doesn't need to logged in to see. In this case, it's the login form */}
        <Route exact path="/" component={App} />
        {/**
         * Using a protected route for the content that user needs to be logged in to see
         */}
        <ProtectedRoute exact path="/bookshelf" component={Bookshelf} />
        <ProtectedRoute path="/book/:id" component={BookDetail} />
        <ProtectedRoute exact path="/search" component={Search} />
      </Switch>
    </CookieProvider>
  );
};
