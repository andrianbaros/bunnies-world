import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    const errStr = error?.toString() || '';
    if (errStr.includes('dynamically imported module') || errStr.includes('Loading chunk') || error?.name === 'ChunkLoadError') {
      const refreshedKey = 'chunk_reload_attempted';
      const hasRefreshed = sessionStorage.getItem(refreshedKey);
      if (!hasRefreshed) {
        sessionStorage.setItem(refreshedKey, 'true');
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-zinc-950 text-white gap-4">
          <h2 className="text-xl font-bold text-pink-500">New Release Deployed</h2>
          <p className="text-xs text-zinc-400 max-w-md">
            The application has been updated with a new build. Reloading the page will load the latest release.
          </p>
          <button
            onClick={() => {
              sessionStorage.removeItem('chunk_reload_attempted');
              window.location.reload();
            }}
            className="px-5 py-2.5 rounded-full bg-pink-500 text-white font-semibold text-xs hover:bg-pink-600 transition-colors shadow-sm"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
