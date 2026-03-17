import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });

    // Log to error tracking service (e.g., Sentry)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // TODO: Send to error tracking service
    // if (typeof Sentry !== 'undefined') {
    //   Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback, level = 'page' } = this.props;

      if (fallback) {
        return fallback;
      }

      if (level === 'app') {
        return (
          <div className="error-boundary error-boundary-app">
            <div className="error-content">
              <AlertTriangle size={48} className="error-icon" />
              <h1>Something went wrong</h1>
              <p>We're sorry, but something unexpected happened. Please try refreshing the page.</p>
              <button onClick={() => window.location.reload()} className="error-button">
                <RefreshCw size={16} />
                Refresh Page
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="error-boundary error-boundary-section">
          <AlertTriangle size={24} className="error-icon" />
          <div className="error-text">
            <p>This section encountered an error.</p>
            <button onClick={this.handleReset} className="error-link">
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
