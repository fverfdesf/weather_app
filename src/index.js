import React from "react";
import { createRoot } from "react-dom/client";
import WeatherApp from "./WeatherApp";
import "./styles.css";
import * as serviceWorker from "./serviceWorker";

function App() {
  return <WeatherApp />;
}
try {
  const root = createRoot(document.querySelector("#root"));
  root.render(<App />);
} catch (e) {
  console.log("error", e);
}

serviceWorker.register();
