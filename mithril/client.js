import App from "./app.mjs";
import { init } from "../src/init.mjs";
import m from "mithril";

function hydrate(fn, node) {
  const clone = node.cloneNode();
  m.mount(clone, fn);
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
