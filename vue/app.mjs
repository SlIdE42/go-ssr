import view from "../src/view.mjs";
import { h, createSSRApp, reactive, onMounted } from "vue";

const text = (s) => s;
const onInput = "onInput";
const space = (s) => (s ? " " : null);

export default function (props) {
  return createSSRApp(
    {
      props: props,
      setup(props) {
        const obj = reactive({ ...props });

        const input = (event) => {
          const { value } = event.target;
          history.pushState({}, "", "/" + encodeURIComponent(value.trim()));

          obj.name = value;
        };

        onMounted(() => {
          obj.loading = false;
        });

        return () => view({ h, text, space, input, onInput })(obj);
      },
    },
    props
  );
}
