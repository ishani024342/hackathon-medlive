"use client";

import { useState, useEffect } from "react";

interface Props {
  agentId: string | null;
  isLoading: boolean;
  onLaunch: () => void;
}

export default function VideoAgent({ agentId, isLoading, onLaunch }: Props) {
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
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
      {agentId ? (
        <div style={{
          width: "100%", height: "100%",
          background: "radial-gradient(ellipse at 30% 40%, #1a3a5c 0%, #0f172a 70%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <div style={{
            width: 120, height: 120, borderRadius: "50%",
            background: "linear-gradient(135deg, #0ea5e9, #10b981)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 52, marginBottom: 16,
            boxShadow: "0 0 40px rgba(14,165,233,0.4)",
            animation: "float 3s ease-in-out infinite",
          }}>🩺</div>

          <div style={{ color: "white", fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
            Dr. MedLive AI
          </div>
          <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 20 }}>
            Healthcare Assistant • Online
          </div>

          <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 32, marginBottom: 20 }}>
            {[0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8].map((h, i) => (
              <div key={i} style={{
                width: 4, borderRadius: 2,
                background: "#0ea5e9",
                height: `${h * 28}px`,
                animation: `soundwave 0.8s ease-in-out ${i * 0.1}s infinite alternate`,
                opacity: 0.8,
              }} />
            ))}
          </div>

          <div style={{
            background: "rgba(14,165,233,0.15)",
            border: "1px solid rgba(14,165,233,0.3)",
            borderRadius: 20, padding: "6px 16px",
            color: "#7dd3fc", fontSize: 12,
          }}>
            "Please describe your symptoms..."
          </div>

          <div className="video-overlay-badge">
            <span className="pulse" />
            Live • {formatTime(seconds)}
          </div>

          <div style={{
            position: "absolute", bottom: 70, right: 16,
            width: 80, height: 60, borderRadius: 8,
            background: camOff ? "#1e293b" : "linear-gradient(135deg, #334155, #1e293b)",
            border: "2px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, color: "#94a3b8",
          }}>
            {camOff ? "🚫" : "👤"}
          </div>

          <div className="video-controls">
            <button className="ctrl-btn" onClick={() => setMuted(!muted)}>{muted ? "🔇" : "🎤"}</button>
            <button className="ctrl-btn" onClick={() => setCamOff(!camOff)}>{camOff ? "📵" : "📷"}</button>
            <button className="ctrl-btn">🖥️</button>
            <button className="ctrl-btn ctrl-btn-end" onClick={() => window.location.reload()}>📵</button>
          </div>

          <style>{`
            @keyframes soundwave {
              from { transform: scaleY(0.4); }
              to { transform: scaleY(1); }
            }
          `}</style>
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
