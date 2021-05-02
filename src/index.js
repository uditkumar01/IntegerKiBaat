import React from "react";
import ReactDOM from "react-dom";
import "./assets/index.css";
import App from "./components/App";
import { ChatContextProvider } from "./ContextProvider/ChatContextProvider";
import { BrowserRouter as Router } from "react-router-dom";
// import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Router>
    <ChatContextProvider>
      <App />
    </ChatContextProvider>
  </Router>,
  document.getElementById("root")
);

// serviceWorker.unregister();
