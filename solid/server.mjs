import h from "hyperscript";
import view from "../src/view.mjs";
import server from "../src/server.mjs";

const renderToString = (s) => s.outerHTML;
const text = (s) => s;
const space = (s) => (s ? " " : null);
const input = () => {};
const onInput = "oninput";

server({
  "/": async (request, reply) => {
    return renderToString(
      h(
        "div",
        { id: "app" },
        view({ h, text, space, input, onInput })({
          ...request.body,
          loading: true,
        })
      )
    );
  },
});
