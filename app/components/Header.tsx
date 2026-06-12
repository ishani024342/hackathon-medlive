// app/components/Header.tsx
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
        <div className="logo-mark">
          <svg viewBox="0 0 24 24"><path d="M19 10.5V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9.5a4.5 4.5 0 0 1 9 0v.5h1v-.5a4.5 4.5 0 0 1 4 0Z" stroke="white" strokeWidth="2" fill="none"/></svg>
        </div>
        <div>
          <div className="logo-text">MedLive</div>
          <div className="logo-sub">ENTERPRISE TELEHEALTH ASSISTANCE</div>
        </div>
      </div>
      
      <div className="header-right">
        {profile?.name && (
          <>
            <div className="user-welcome-badge">
              Active Session: {profile.name}
            </div>
            <div className="header-badge">
              <span className="pulse" />
              Biometric Link Secured
            </div>
          </>
        )}
      </div>
    </header>
  );
}