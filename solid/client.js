import { render } from "solid-js/web";
// import { hydrate } from "solid-js/web";
import App from "./app.mjs";
import { init } from "../src/init.mjs";

// https://www.solidjs.com/docs/latest/api#hydrate
function hydrate(fn, node) {
  const clone = node.cloneNode();
  render(fn, clone);
  node.parentNode.replaceChild(clone, node);
}

function launch() {
  hydrate(App(init("init")), document.getElementById("app"));
}

if (document.readyState === "interactive") {
  launch();
} else {
  window.addEventListener("DOMContentLoaded", launch);
}
