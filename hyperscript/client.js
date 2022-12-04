import App from "./app.mjs";
import { init } from "../src/init.mjs";

function hydrate(fn, node) {
  const clone = node.cloneNode();
  clone.appendChild(fn);
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
