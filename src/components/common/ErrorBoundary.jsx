import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-[var(--bg-main)] text-[var(--text-primary)] gap-4">
          <h1 className="text-2xl font-bold text-[var(--text-heading)]">Something went wrong</h1>
          <p className="text-xs text-[var(--text-muted)] max-w-md">
            An unexpected application error occurred. Please try reloading the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-full bg-pink-500 text-white font-bold text-xs hover:bg-pink-600 transition-colors shadow-sm"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
