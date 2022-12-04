import App from "./app.mjs";
import server from "../src/server.mjs";
import render from "mithril-node-render";

if (!global.window) {
  global.window = global.document = global.requestAnimationFrame = undefined;
}

server({
  "/": async (request, reply) => {
    return `<div id="app">${await render(
      App({ ...request.body, loading: true })
    )}</div>`;
  },
});
