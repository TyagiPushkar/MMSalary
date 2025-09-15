import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import "./index.css";
import { HashRouter as Router, BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./redux/store";
import { ContextProvider } from "./contexts/ContextProvider";
import { MenuProvider } from "./contexts/menuContext";

ReactDOM.render(
  <Router basename="">
    <ContextProvider>
      <MenuProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </MenuProvider>
    </ContextProvider>
  </Router>,
  document.getElementById("root")
);
