import React, {Component} from "../../_snowpack/pkg/react.js";
import {handleError} from "../helpers/handlers.js";
class ErrorBoundary extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      error: null
    };
  }
  static getDerivedStateFromError(e) {
    return {error: e};
  }
  componentDidCatch(error, errorInfo) {
    handleError(error);
  }
  render() {
    if (this.state.error) {
      return /* @__PURE__ */ React.createElement("p", null, "Error: ", this.state.error.message);
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
