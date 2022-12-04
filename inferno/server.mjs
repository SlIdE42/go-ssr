import { renderToString } from "inferno-server";
import App from "./app.mjs";
import server from "../src/server.mjs";
import { h } from "inferno-hyperscript";

server({
  "/": async (request, reply) => {
    return renderToString(
      h("div", { id: "app" }, h(App, { ...request.body, loading: true }))
    );
  },
});
