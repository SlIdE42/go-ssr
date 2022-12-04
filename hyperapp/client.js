import { app } from "hyperapp";
import { init } from "../src/init.mjs";
import view from "./app.mjs";

function launch() {
  const dispatch = app({
    init: { ...init("init"), loading: false },
    view: view,
    node: document.getElementById("app"),
  });
}

if (document.readyState === "interactive") {
  launch();
} else {
  window.addEventListener("DOMContentLoaded", launch);
}
