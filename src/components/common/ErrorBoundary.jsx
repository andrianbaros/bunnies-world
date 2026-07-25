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
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-black text-white gap-4">
          <div className="text-5xl">🐰⚠️</div>
          <h2 className="text-2xl font-bold text-pink-300">Something went wrong in the Universe</h2>
          <p className="text-xs text-gray-400 max-w-md">{this.state.error?.toString()}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-xs hover:scale-105 transition-transform"
          >
            Reload Universe
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
