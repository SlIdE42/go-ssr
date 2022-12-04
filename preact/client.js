import { h, hydrate } from "preact";
import { useState, useEffect } from "preact/hooks";
import App from "../react/app.mjs";
import { init } from "../src/init.mjs";

function launch() {
  hydrate(
    h(App({ h, useState, useEffect }), init("init")),
    document.getElementById("app")
  );
}

if (document.readyState === "interactive") {
  launch();
} else {
  window.addEventListener("DOMContentLoaded", launch);
}
