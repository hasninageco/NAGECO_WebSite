export default function GlobalLoading() {
  return (
    <div className="nageco-global-loader" role="status" aria-live="polite" aria-label="Loading content">
      <div className="nageco-global-loader__panel">
        <img
          src="/nageco-logo.svg"
          alt="NAGECO Logo"
          width={963}
          height={333}
          className="nageco-global-loader__logo"
          fetchPriority="high"
        />
        <div className="nageco-global-loader__bar">
          <span className="nageco-global-loader__bar-fill" />
        </div>
      </div>
    </div>
  );
}

