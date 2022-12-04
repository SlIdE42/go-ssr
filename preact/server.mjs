import App from "../react/app.mjs";
import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import render from "preact-render-to-string";
import server from "../src/server.mjs";

server({
  "/": async (request, reply) => {
    return render(
      h(
        "div",
        { id: "app" },
        h(App({ h, useState, useEffect }), { ...request.body, loading: true })
      )
    );
  },
});
