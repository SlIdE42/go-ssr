import { h, text } from "hyperapp";
import view from "../src/view.mjs";

const input = (state, event) => {
  const name = event.target.value;
  history.pushState({}, "", "/" + encodeURIComponent(name.trim()));

  return { ...state, name: name };
};

const onInput = "oninput";
const space = (s) => (s ? text(" ") : null);

export default function (props) {
  return h(
    "div",
    { id: "app" },
    view({ h, text, space, input, onInput })(props)
  );
}
