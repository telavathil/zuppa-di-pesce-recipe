import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../zuppa-di-pesce.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
