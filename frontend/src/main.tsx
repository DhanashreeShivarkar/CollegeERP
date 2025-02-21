import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Import Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Import custom styles
import "./styles/main.scss";
import "animate.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
