"use client";

export default function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-mark">🩺</div>
        <div>
          <div className="logo-text">MedLive</div>
          <div className="logo-sub">Real-Time Healthcare AI Agent</div>
        </div>
      </div>
      <div className="header-right">
        <div className="header-badge">
          <span className="pulse" />
          Powered by TruGen AI
        </div>
        <button
          onClick={() => window.location.href = "/"}
          style={{
            padding: "6px 14px", borderRadius: 20,
            border: "1px solid #e2e8f0", background: "white",
            fontSize: 12, fontWeight: 500, cursor: "pointer",
            color: "#475569", fontFamily: "DM Sans, sans-serif",
          }}
        >
          🏠 Dashboard
        </button>
        <button
          onClick={() => window.location.href = "/login"}
          style={{
            padding: "6px 14px", borderRadius: 20, border: "none",
            background: "linear-gradient(135deg, #0ea5e9, #10b981)",
            fontSize: 12, fontWeight: 500, cursor: "pointer",
            color: "white", fontFamily: "DM Sans, sans-serif",
          }}
        >
          Sign In
        </button>
        <div className="header-avatar">P</div>
      </div>
    </header>
  );
}
