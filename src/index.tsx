import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {Amplify} from "aws-amplify";
import {AWSConfig} from "./config/AwsConfig";
import {createMuiTheme, ThemeProvider} from '@material-ui/core';

Amplify.configure(AWSConfig);

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: '#1b191a',
      contrastText: "#bbbbbb"
    },
    background: {
      paper: "#161415",
      default: "#191718"
    },
    text: {
      primary: "#bbb",
      secondary: "#86a4ab",
      disabled: "#6f6f6f",
    },
    divider: "#211e1e",
    action: {
      hover: "#251719",
      focus: "#251719",
      selected: "#251719"
    }
  },
});


ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App/>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
