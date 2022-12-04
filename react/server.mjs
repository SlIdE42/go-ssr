import * as ReactDOMServer from "react-dom/server";
import React, { useState, useEffect } from "react";
import App from "./app.mjs";
import server from "../src/server.mjs";

const h = React.createElement;

server({"/": async (request, reply) => {
  return ReactDOMServer.renderToString(
    h(
      "div",
      { id: "app" },
      h(App({ h, useState, useEffect }), { ...request.body, loading: true })
    )
  );
}});
