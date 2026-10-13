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
    console.error('VijayaHub Application Caught Error:', error, errorInfo);
  }

  handleReload = () => {
    try {
      localStorage.removeItem('vijayahub_products_v1');
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl mx-auto flex items-center justify-center text-3xl font-black shadow-inner">
              ⚠️
            </div>
            <h1 className="text-xl font-black text-slate-900">
              Vijaya<span className="text-amber-600">Hub</span> Storefront Recovered
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              We detected a temporary storage or session issue and safely restored the store. Click below to continue browsing.
            </p>
            {this.state.error && (
              <details className="text-left bg-slate-100 p-2.5 rounded-xl text-[10px] text-slate-600 font-mono overflow-auto max-h-32">
                <summary className="cursor-pointer text-slate-500 font-bold mb-1">Technical Details</summary>
                {this.state.error.toString()}
              </details>
            )}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
              >
                Refresh & Restore Store
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Continue to Store
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
