import App from "./app.mjs";
import { init } from "../src/init.mjs";

function launch() {
  App(init("init")).mount(document.getElementById("app"));
}

if (document.readyState === "interactive") {
  launch();
} else {
  window.addEventListener("DOMContentLoaded", launch);
}
