import h from "hyperscript";
import o from "observable";
import view from "../src/view.mjs";

const text = (s) => s;
const onInput = "oninput";
const space = (s) => {
  const v = o();
  s(() => (s() ? v(" ") : v("")));
  return v;
};

const name = o("");
const loading = o(true);
name(() => setTimeout(() => loading(loading()), 0));

const input = (event) => {
  const { value } = event.target;
  history.pushState({}, "", "/" + encodeURIComponent(value.trim()));

  name(value);
};

export default function (props) {
  loading(false);
  name(props.name);

  return view({ h, text, space, input, onInput })({ name, loading });
}
