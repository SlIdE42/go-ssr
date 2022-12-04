import view from "../src/view.mjs";
import { Component } from "inferno";
import { h } from "inferno-hyperscript";

const text = (s) => s;
const onInput = "onInput";
const space = (s) => (s ? " " : null);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      loading: props.loading,
    };

    this.input = this.input.bind(this);
  }

  componentDidMount() {
    this.setState({ ...this.state, loading: false });
  }

  render() {
    return view({ h, text, space, input: this.input, onInput })(this.state);
  }

  input(event) {
    const { value } = event.target;
    history.pushState({}, "", "/" + encodeURIComponent(value.trim()));

    this.setState({ ...this.state, name: value });
  }
}
