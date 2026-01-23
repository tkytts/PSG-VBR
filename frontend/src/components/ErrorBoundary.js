import React from "react";

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
      return <div role="alert">Something went wrong.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;