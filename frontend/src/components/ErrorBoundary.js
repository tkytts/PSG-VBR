import React from "react";

import i18n from "../i18n";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // Optionally log
    // console.error(error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div role="alert">{i18n.t("error_boundary_message")}</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;