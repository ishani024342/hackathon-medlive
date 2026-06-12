// app/components/VideoAgent.tsx
"use client";

interface Props {
  agentId: string | null;
  agentUrl: string | null;
  isLoading: boolean;
  onLaunch: () => void;
  errorMessage?: string | null;
}

export default function VideoAgent({ agentId, agentUrl, isLoading, onLaunch, errorMessage }: Props) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {agentId && agentUrl ? (
        <iframe
          src={agentUrl}
          allow="camera; microphone; fullscreen"
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        <div className="video-placeholder">
          <div className="logo-mark" style={{width: 64, height: 64, borderRadius: '50%'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:32, height:32}}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <h2>Initialize Video Engine</h2>
          <p>Launch the real-time clinical assessment agent interface. System telemetry data will sync automatically into session layers.</p>
          <button className="launch-btn" onClick={onLaunch} disabled={isLoading}>
            {isLoading ? "Synchronizing Modules..." : "Start Professional Consultation"}
          </button>
          {errorMessage && <p className="launch-error">{errorMessage}</p>}
        </div>
      )}
    </div>
  );
}