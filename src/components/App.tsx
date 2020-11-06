import './App.css';
import {withAuthenticator} from "@aws-amplify/ui-react";
import React from 'react';
import Header from "./header/Header";

const App = () => (
  <div className="App">
    <Header/>
  </div>
);

export default withAuthenticator(App);
