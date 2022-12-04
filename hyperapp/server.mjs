import { renderToString } from "hyperapp-render";
import view from "./app.mjs";
import server from "../src/server.mjs";

server({
  "/": async (request, reply) => {
    return renderToString(view({ ...request.body, loading: true }));
  },
});
