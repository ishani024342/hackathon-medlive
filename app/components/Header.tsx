"use client";

interface HeaderProps {
  profile?: {
    name: string;
  };
}

export default function Header({ profile }: HeaderProps) {
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
        {profile?.name ? (
          <>
            <div className="user-welcome-badge">
              Active Record: {profile.name}
            </div>
            <div className="header-badge">
              <span className="pulse" />
              Biometric Link Secured
            </div>
          </>
        ) : (
          <div className="header-badge" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-3)", border: "1px solid var(--border)" }}>
            Secure Gateway
          </div>
        )}
      </div>
    </header>
  );
}