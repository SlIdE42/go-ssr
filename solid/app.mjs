import { createSignal, onMount } from "solid-js";
import h from "solid-js/h";
import view from "../src/view.mjs";

const text = (s) => s;
const onInput = "onInput";
const space = (s) => () => s() ? " " : null;

export default function (props) {
  const [name, setName] = createSignal(props.name);
  const [loading, setLoading] = createSignal(props.loading);

  const input = (event) => {
    const { value } = event.target;
    history.pushState({}, "", "/" + encodeURIComponent(value.trim()));

    setName(value);
  };

  onMount(() => {
    setLoading(false);
  });

  return view({ h, text, space, input, onInput })({ name, loading });
}
