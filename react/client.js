import React, { useState, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./app.mjs";
import { init } from "../src/init.mjs";

const h = React.createElement;

function launch() {
  hydrateRoot(
    document.getElementById("app"),
    h(App({ h, useState, useEffect }), init("init"))
  );
}

if (document.readyState === "interactive") {
  launch();
} else {
  window.addEventListener("DOMContentLoaded", launch);
}
