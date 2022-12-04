import { renderToString } from "vue/server-renderer";
import App from "./app.mjs";
import server from "../src/server.mjs";

server({
  "/": async (request, reply) => {
    return `<div id="app">${await renderToString(
      App({ ...request.body, loading: true })
    )}</div>`;
  },
});
