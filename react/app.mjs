import view from "../src/view.mjs";

const text = (s) => s;
const onInput = "onInput";
const space = (s) => (s ? " " : null);

export default function ({ h, useState, useEffect }) {
  return function (props) {
    const [name, setName] = useState(props.name);
    const [loading, setLoading] = useState(props.loading);

    const input = (event) => {
      const { value } = event.target;
      history.pushState({}, "", "/" + encodeURIComponent(value.trim()));

      setName(value);
    };

    useEffect(() => {
      setLoading(false);
    }, []);

    return view({ h, text, space, input, onInput })({ name, loading });
  };
}
