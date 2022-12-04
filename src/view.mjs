export default function ({ h, text, space, input, onInput }) {
  return function ({ name, loading }) {
    return h(
      "main",
      {},
      h("div", { className: "person" }, [
        h("input", {
          type: "text",
          placeholder: "Enter your name...",
          value: name,
          [onInput]: input,
          disabled: loading,
        }),
        h("p", {}, [
          text("Happy birthday"),
          space(name),
          h("strong", {}, text(name)),
          text("!"),
        ]),
      ])
    );
  };
}
