import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import clayful from "clayful/client-js";
import axios from "axios";
import "./css/auth.css";

clayful.config({
  client:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjNjMjdlNDIyYmRlNDExOTE4NmE2ZDNmMjBlYjM0YWY0NWJkNDFmOWZmZTI0ZDIwYWIxYjFkZTZiM2JjZGE1ODgiLCJyb2xlIjoiY2xpZW50IiwiaWF0IjoxNjQxODY3ODc3LCJzdG9yZSI6IlBTRUo2WFBXRUhOUy5WRVFVTFhXUlpDNFMiLCJzdWIiOiJXU0tKMjRIRkEyVVUifQ.3aht5061nRBQe8KY4kHi7soLnqXWjhq2Bx_gm3hyOXw",
});
clayful.install("request", require("clayful/plugins/request-axios")(axios));

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
