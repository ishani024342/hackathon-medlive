"use client";

import { useState, useEffect } from "react";
import VideoAgent from "./components/VideoAgent";
import ChatPanel from "./components/ChatPanel";
import HospitalsPanel from "./components/HospitalsPanel";
import ReportUpload from "./components/ReportUpload";
import Header from "./components/Header";

function useAnimatedVital(base: number, min: number, max: number, interval: number) {
  const [value, setValue] = useState(base);
  useEffect(() => {
    const timer = setInterval(() => {
      const change = (Math.random() - 0.5) * 2;
      setValue((prev) => {
        const next = parseFloat((prev + change).toFixed(1));
        return next < min ? min : next > max ? max : next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [min, max, interval]);
  return value;
}

export default function Home() {
  const [agentId, setAgentId] = useState<string | null>(null);
  const [agentUrl, setAgentUrl] = useState<string | null>(null);
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "hospitals" | "report">("chat");

  // Animated vitals
  const heartRate = useAnimatedVital(72, 60, 90, 1200);
  const spo2 = useAnimatedVital(98, 95, 100, 1800);
  const temperature = useAnimatedVital(98.6, 97.5, 99.5, 3000);

  // Blood pressure animates systolic and diastolic separately
  const systolic = useAnimatedVital(120, 110, 135, 2000);
  const diastolic = useAnimatedVital(80, 70, 90, 2000);

  const getHeartStatus = (v: number) => v > 85 ? "warning" : "normal";
  const getSpo2Status = (v: number) => v < 96 ? "warning" : "normal";
  const getTempStatus = (v: number) => v > 99 ? "warning" : "normal";
  const getBPStatus = (s: number) => s > 130 ? "warning" : "normal";

  const launchAgent = async () => {
    setIsAgentLoading(true);
    setAgentError(null);
    try {
      const res = await fetch("/api/agent", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data?.error || "Failed to start consultation.";
        setAgentError(errorMessage);
        console.error("Failed to create agent:", errorMessage);
        return;
      }

      setAgentId(data.id);
      setAgentUrl(data.url);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setAgentError(message);
      console.error("Failed to create agent:", message);
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
              <VitalItem
                label="Heart Rate"
                value={Math.round(heartRate).toString()}
                unit="bpm"
                icon="❤️"
                status={getHeartStatus(heartRate)}
              />
              <VitalItem
                label="SpO₂"
                value={Math.min(100, Math.round(spo2)).toString()}
                unit="%"
                icon="🫁"
                status={getSpo2Status(spo2)}
              />
              <VitalItem
                label="Blood Pressure"
                value={`${Math.round(systolic)}/${Math.round(diastolic)}`}
                unit="mmHg"
                icon="🩺"
                status={getBPStatus(systolic)}
              />
              <VitalItem
                label="Temperature"
                value={temperature.toFixed(1)}
                unit="°F"
                icon="🌡️"
                status={getTempStatus(temperature)}
              />
            </div>
            <p className="vitals-note">
              {[getHeartStatus(heartRate), getSpo2Status(spo2), getTempStatus(temperature), getBPStatus(systolic)].includes("warning")
                ? "⚠️ Some vitals need attention"
                : "✅ All vitals normal"}
            </p>
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
          <VideoAgent agentId={agentId} agentUrl={agentUrl} isLoading={isAgentLoading} onLaunch={launchAgent} errorMessage={agentError} />
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

function VitalItem({ label, value, unit, icon, status }: {
  label: string; value: string; unit: string; icon: string; status: string;
}) {
  return (
    <div className={`vital-item vital-${status}`} style={{
      transition: "all 0.5s ease",
      borderLeft: status === "warning" ? "3px solid #f59e0b" : "3px solid #10b981",
    }}>
      <span className="vital-icon" style={{
        animation: label === "Heart Rate" ? "pulse 1.2s ease-in-out infinite" : "none",
      }}>{icon}</span>
      <div>
        <div className="vital-value" style={{
          color: status === "warning" ? "#f59e0b" : undefined,
          transition: "color 0.5s ease",
        }}>
          {value} <span className="vital-unit">{unit}</span>
        </div>
        <div className="vital-label">{label}</div>
      </div>
    </div>
  );
}