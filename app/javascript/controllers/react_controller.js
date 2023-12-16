import { Controller } from "@hotwired/stimulus"
import React from "react"
import { createRoot } from "react-dom/client"
import App from "../components/App"
import { store } from '../store/store';
import { Provider } from 'react-redux'

// Connects to data-controller="react"
export default class extends Controller {
  connect() {
    console.log("React controller connected")
    const app = document.getElementById("app")
    createRoot(app).render(
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}
