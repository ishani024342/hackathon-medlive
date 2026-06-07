"use client";

import { useState } from "react";
import VideoAgent from "./components/VideoAgent";
import ChatPanel from "./components/ChatPanel";
import HospitalsPanel from "./components/HospitalsPanel";
import ReportUpload from "./components/ReportUpload";
import Header from "./components/Header";

export default function Home() {
  const [agentId, setAgentId] = useState<string | null>(null);
  const [agentUrl, setAgentUrl] = useState<string | null>(null);
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "hospitals" | "report">("chat");

  const launchAgent = async () => {
    setIsAgentLoading(true);
    try {
      const res = await fetch("/api/agent", { method: "POST" });
      const data = await res.json();
      setAgentId(data.id);
      setAgentUrl(data.url);   // ← store the iframe URL
    } catch (err) {
      console.error("Failed to create agent:", err);
    } finally {
      setIsAgentLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Header />
      <main className="main-grid">
        <aside className="left-panel">
          <div className="panel-card vitals-card">
            <h3 className="panel-title"><span className="dot dot-green" />Live Vitals Monitor</h3>
            <div className="vitals-grid">
              <VitalItem label="Heart Rate" value="72" unit="bpm" icon="❤️" status="normal" />
              <VitalItem label="SpO₂" value="98" unit="%" icon="🫁" status="normal" />
              <VitalItem label="Blood Pressure" value="120/80" unit="mmHg" icon="🩺" status="normal" />
              <VitalItem label="Temperature" value="98.6" unit="°F" icon="🌡️" status="normal" />
            </div>
            <p className="vitals-note">Connect a wearable to stream real-time data</p>
          </div>
          <div className="panel-card session-card">
            <h3 className="panel-title">Session Info</h3>
            <div className="session-info">
              <div className="info-row"><span>Status</span><span className={`badge ${agentId ? "badge-active" : "badge-idle"}`}>{agentId ? "Active" : "Idle"}</span></div>
              <div className="info-row"><span>Mode</span><span>Real-Time Video</span></div>
              <div className="info-row"><span>Language</span><span>English (IN)</span></div>
              <div className="info-row"><span>Powered by</span><span>TruGen AI</span></div>
            </div>
          </div>
        </aside>

        <section className="center-panel">
          {/* ← now passes agentUrl too */}
          <VideoAgent agentId={agentId} agentUrl={agentUrl} isLoading={isAgentLoading} onLaunch={launchAgent} />
        </section>

        <aside className="right-panel">
          <div className="tab-bar">
            {(["chat", "hospitals", "report"] as const).map((tab) => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? "tab-active" : ""}`} onClick={() => setActiveTab(tab)}>
                {tab === "chat" ? "💬 Chat" : tab === "hospitals" ? "🏥 Hospitals" : "📋 Report"}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {activeTab === "chat" && <ChatPanel agentId={agentId} />}
            {activeTab === "hospitals" && <HospitalsPanel />}
            {activeTab === "report" && <ReportUpload />}
          </div>
        </aside>
      </main>
    </div>
  );
}

function VitalItem({ label, value, unit, icon, status }: { label: string; value: string; unit: string; icon: string; status: string }) {
  return (
    <div className={`vital-item vital-${status}`}>
      <span className="vital-icon">{icon}</span>
      <div>
        <div className="vital-value">{value} <span className="vital-unit">{unit}</span></div>
        <div className="vital-label">{label}</div>
      </div>
    </div>
  );
}