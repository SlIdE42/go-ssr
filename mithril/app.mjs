import view from "../src/view.mjs";
import m from "mithril";

const text = (s) => s;
const onInput = "oninput";
const space = (s) => (s ? " " : null);

export default function ({ name, loading }) {
  const input = (event) => {
    const { value } = event.target;
    history.pushState({}, "", "/" + encodeURIComponent(value.trim()));

    name = value;
  };

  return {
    oncreat: function (vnode) {
      loading = false;
    },
    view: function (vnode) {
      return view({ h: m, text, space, input, onInput })({ name, loading });
    },
  };
}
