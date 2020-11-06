import './App.css';
import {withAuthenticator} from "@aws-amplify/ui-react";
import React from 'react';
import Header from "./header/Header";
import {Route, Switch, Redirect, Router} from 'react-router-dom';
import {createMemoryHistory} from 'history'

const history = createMemoryHistory();

const App = () => (
  <Router history={history}>
    <div className="App">
      <Header/>
      <Switch>
        <Route path='/'>
          <div>Home</div>
        </Route>
        <Route path='/upload'>
          <div>Upload</div>
        </Route>
        <Route path='/oauth/callback'>
          <Redirect to={"/"}/>
        </Route>
      </Switch>
    </div>
  </Router>
);

export default withAuthenticator(App);
