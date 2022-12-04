import App from "./app.mjs";
import { init } from "../src/init.mjs";
import { h } from "inferno-hyperscript";
import { hydrate } from "inferno-hydrate";

function launch() {
  hydrate(h(App, init("init")), document.getElementById("app"));
}

if (document.readyState === "interactive") {
  launch();
} else {
  window.addEventListener("DOMContentLoaded", launch);
}
