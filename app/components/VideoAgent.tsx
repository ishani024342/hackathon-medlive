"use client";

import { useState, useEffect } from "react";

interface Props {
  agentId: string | null;
  agentUrl: string | null;
  isLoading: boolean;
  onLaunch: () => void;
}

export default function VideoAgent({ agentId, agentUrl, isLoading, onLaunch }: Props) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!agentId) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [agentId]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="video-container">
      {agentId && agentUrl ? (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          
          {/* ✅ Real TruGen AI iframe */}
          <iframe
            src={agentUrl}
            allow="camera; microphone; fullscreen"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: "12px",
            }}
          />

          {/* Live timer badge */}
          <div className="video-overlay-badge">
            <span className="pulse" />
            Live • {formatTime(seconds)}
          </div>

        </div>
      ) : (
        <div className="video-placeholder">
          <div className="video-icon">🩺</div>
          <div>
            <h2>Meet Your AI Health Assistant</h2>
            <p>Describe your symptoms, get health guidance, find nearby hospitals, and upload reports — all in a real-time video conversation.</p>
          </div>
          <div className="agent-features">
            <span className="feature-chip">👁️ Vision AI</span>
            <span className="feature-chip">🎙️ Real-Time</span>
            <span className="feature-chip">🔒 Private</span>
          </div>
          <button className="launch-btn" onClick={onLaunch} disabled={isLoading}>
            {isLoading ? <>⏳ Starting Agent...</> : <>🚀 Start Consultation</>}
          </button>
        </div>
      )}
    </div>
  );
}