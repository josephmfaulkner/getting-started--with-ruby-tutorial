// Entry point built by Shakapacker (./bin/shakapacker) and loaded by app/views/layouts/application.html.erb
import "trix"
import "@rails/actiontext"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "../App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
