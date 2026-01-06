
import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import './index.css'
import App from "./App";
import Modal from "react-modal";
import { HashRouter } from 'react-router-dom'

Modal.setAppElement('#root'); // registra o elemento principal da app para react-modal

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
