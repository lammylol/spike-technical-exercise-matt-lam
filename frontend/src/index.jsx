import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/colors.css";
import App from "./App.tsx";
import ErrorBoundary from "./errorBoundary.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
