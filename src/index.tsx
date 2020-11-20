import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {Amplify} from "aws-amplify";
import {AWSConfig} from "./config/AwsConfig";
import {createMuiTheme, ThemeProvider} from '@material-ui/core';
import {fetchApplicationConfiguration, history} from "./config/Configuration";
import {Provider} from "react-redux";
import {PersistGate} from 'redux-persist/integration/react';
import {ConnectedRouter} from "connected-react-router";

Amplify.configure(AWSConfig);

const theme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    }
  },
  palette: {
    type: "dark",
    primary: {
      main: '#1b191a',
      contrastText: "#bbbbbb"
    },
    secondary: {
      main: '#4c9697'
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


const {store, persistor} = fetchApplicationConfiguration();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConnectedRouter history={history}>
          <ThemeProvider theme={theme}>
            <App/>
          </ThemeProvider>
        </ConnectedRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
