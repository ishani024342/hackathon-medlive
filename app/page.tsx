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

const LANGUAGES = [
  { code: "en", label: "English (IN)", flag: "🇬🇧" },
  { code: "hi", label: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { code: "ta", label: "தமிழ் (Tamil)", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు (Telugu)", flag: "🇮🇳" }
];

export default function Home() {
  const [appState, setAppState] = useState<"LOGIN" | "INTAKE" | "CONSULTATION">("LOGIN");
  const [consultationMode, setConsultationMode] = useState<"CHAT" | "VIDEO">("CHAT");
  const [selectedLang, setSelectedLang] = useState("en");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    academicLocation: "",
    specialization: "",
  });

  const [symptomBrief, setSymptomBrief] = useState("");
  const [userBloodGroup, setUserBloodGroup] = useState("Not Specified");
  const [userAllergies, setUserAllergies] = useState("None");
  const [severity, setSeverity] = useState("Mild / Manageable");
  const [duration, setDuration] = useState("1-2 Days");

  const [agentId, setAgentId] = useState<string | null>(null);
  const [agentUrl, setAgentUrl] = useState<string | null>(null);
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"hospitals" | "report">("hospitals");

  const heartRate = useAnimatedVital(72, 65, 82, 1200);
  const spo2 = useAnimatedVital(99, 97, 100, 1800);
  const temperature = useAnimatedVital(98.4, 97.9, 98.9, 3000);
  const systolic = useAnimatedVital(120, 116, 124, 2000);
  const diastolic = useAnimatedVital(80, 76, 82, 2000);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLoginError("Please enter valid credentials.");
      return;
    }
    setLoginError("");
    const rawName = email.split("@")[0].replace(/[._]/g, " ");
    const formattedName = rawName.replace(/\b\w/g, (c) => c.toUpperCase());
    setUserProfile({
      name: formattedName,
      email: email,
      academicLocation: "MedLive Patient Portal",
      specialization: "General Consultation",
    });
    setAppState("INTAKE");
  };

  const handleConnectConsultation = async (chosenMode: "CHAT" | "VIDEO") => {
    setConsultationMode(chosenMode);
    setAppState("CONSULTATION");

    if (chosenMode === "VIDEO") {
      setIsAgentLoading(true);
      setAgentError(null);
      try {
        const res = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userProfile,
            languageCode: selectedLang,
            intakeData: {
              symptoms: symptomBrief || "Routine checkup baseline update",
              bloodGroup: userBloodGroup,
              allergies: userAllergies,
              severity,
              duration
            }
          })
        });
        const data = await res.json();
        if (!res.ok) {
          setAgentError(data?.error || "Failed to initialize clinical connection.");
          return;
        }
        setAgentId(data.id);
        setAgentUrl(data.url);
      } catch {
        setAgentError("Could not bridge call connection securely.");
      } finally {
        setIsAgentLoading(false);
      }
    }
  };

  return (
    <div className="app-shell">
      <Header profile={appState !== "LOGIN" ? userProfile : undefined} />

      {/* LOGIN */}
      {appState === "LOGIN" && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "radial-gradient(circle at center, #0c1224 0%, #05070f 100%)" }}>
          <form onSubmit={handleLoginSubmit} style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "40px", borderRadius: "20px", maxWidth: "420px", width: "100%", boxShadow: "var(--shadow-md)" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div className="logo-mark" style={{ width: "48px", height: "48px", borderRadius: "12px", margin: "0 auto 16px" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ width: 24, height: 24 }}><path d="M19 10.5V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9.5a4.5 4.5 0 0 1 9 0v.5h1v-.5a4.5 4.5 0 0 1 4 0Z" /></svg>
              </div>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "24px", fontWeight: 800, color: "white" }}>Login / Register</h2>
              <p style={{ color: "var(--text-2)", fontSize: "13px", marginTop: "6px" }}>Patient Access</p>
            </div>

            {loginError && (
              <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "12px", borderRadius: "8px", color: "#f87171", fontSize: "13px", marginBottom: "20px" }}>
                ⚠️ {loginError}
              </div>
            )}

            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", color: "var(--text-2)", fontSize: "12px", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase" }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: "100%", padding: "12px 14px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "8px", color: "white", outline: "none", fontSize: "14px" }} />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "var(--text-2)", fontSize: "12px", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase" }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "12px 14px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "8px", color: "white", outline: "none", fontSize: "14px" }} />
            </div>

            <button type="submit" className="launch-btn" style={{ width: "100%", padding: "14px", justifyContent: "center" }}>
              Authenticate Record →
            </button>
          </form>
        </div>
      )}

      {/* INTAKE */}
      {appState === "INTAKE" && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "radial-gradient(circle at center, #0c1224 0%, #05070f 100%)" }}>
          <div style={{ maxWidth: "1000px", width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 380px", gap: "28px" }}>

            <div className="panel-card" style={{ padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center", marginBottom: 0 }}>
              <div style={{ marginBottom: "24px" }}>
                <span className="badge badge-active" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.2)", marginBottom: "12px", display: "inline-block" }}>
                  Step 2: Condition Assessment
                </span>
                <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "28px", fontWeight: 800, color: "white", marginBottom: "6px" }}>What health inquiries do you have today?</h1>
              </div>

              <div style={{ marginBottom: "24px", background: "var(--surface2)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "11px", fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Preferred Consultation Language</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {LANGUAGES.map((lang) => (
                    <div
                      key={lang.code}
                      onClick={() => setSelectedLang(lang.code)}
                      style={{
                        padding: "10px 14px", borderRadius: "8px", cursor: "pointer",
                        border: selectedLang === lang.code ? "1px solid var(--primary)" : "1px solid var(--border)",
                        background: selectedLang === lang.code ? "rgba(14, 165, 233, 0.08)" : "var(--surface)",
                        display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", transition: "all 0.15s ease"
                      }}
                    >
                      <span>{lang.flag}</span>
                      <span style={{ fontWeight: selectedLang === lang.code ? 600 : 400, color: selectedLang === lang.code ? "white" : "var(--text-2)" }}>{lang.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "11px", fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase" }}>Symptoms Brief Description</label>
                <textarea className="console-input" style={{ width: "100%", minHeight: "80px", background: "var(--surface2)", borderRadius: "10px", border: "1px solid var(--border)", padding: "14px", color: "white", outline: "none", fontSize: "13px" }} placeholder="Describe your symptoms clearly..." value={symptomBrief} onChange={(e) => setSymptomBrief(e.target.value)} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "11px", fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase" }}>Blood Group (Optional)</label>
                  <select value={userBloodGroup} onChange={(e) => setUserBloodGroup(e.target.value)} style={{ width: "100%", padding: "12px", background: "var(--surface2)", color: "white", border: "1px solid var(--border)", borderRadius: "8px", outline: "none" }}>
                    <option>Not Specified</option>
                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "11px", fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase" }}>Known Allergies</label>
                  <input type="text" value={userAllergies} onChange={(e) => setUserAllergies(e.target.value)} placeholder="None" style={{ width: "100%", padding: "12px", background: "var(--surface2)", color: "white", border: "1px solid var(--border)", borderRadius: "8px", outline: "none", fontSize: "13px" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "11px", fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase" }}>Severity Level</label>
                  <select value={severity} onChange={(e) => setSeverity(e.target.value)} style={{ width: "100%", padding: "12px", background: "var(--surface2)", color: "white", border: "1px solid var(--border)", borderRadius: "8px", outline: "none" }}>
                    <option>Mild / Manageable</option>
                    <option>Moderate / Distressing</option>
                    <option>Severe / Acute</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "11px", fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase" }}>Symptom Duration</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: "100%", padding: "12px", background: "var(--surface2)", color: "white", border: "1px solid var(--border)", borderRadius: "8px", outline: "none" }}>
                    <option>Just Started Today</option>
                    <option>1-2 Days</option>
                    <option>3-7 Days</option>
                    <option>Chronic Condition</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label style={{ display: "block", marginBottom: "10px", fontSize: "11px", fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase" }}>Select Consultation Format</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <button onClick={() => handleConnectConsultation("CHAT")} className="launch-btn" style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)", border: "1px solid var(--border)", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "20px" }}>💬</span>
                    <div style={{ fontWeight: 700, fontSize: "14px" }}>Secure Text Chat</div>
                  </button>
                  <button onClick={() => handleConnectConsultation("VIDEO")} className="launch-btn" style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "20px" }}>🎥</span>
                    <div style={{ fontWeight: 700, fontSize: "14px" }}>Live Video Avatar</div>
                  </button>
                </div>
              </div>

              <button className="launch-btn" style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-2)", boxShadow: "none", width: "fit-content" }} onClick={() => setAppState("LOGIN")}>
                ← Back to Login
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="panel-card" style={{ marginBottom: 0 }}>
                <h3 className="panel-title" style={{ fontSize: "11px", color: "#10b981" }}><span className="pulse" /> Verified Account</h3>
                <div className="profile-summary-box" style={{ background: "rgba(14, 165, 233, 0.02)" }}>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "white", marginBottom: "6px" }}>{userProfile.name}</div>
                  <div className="profile-meta-line">Email: <strong>{userProfile.email}</strong></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CONSULTATION */}
      {appState === "CONSULTATION" && (
        <main className="main-grid" style={{ gridTemplateColumns: "1fr 320px", gap: "20px", padding: "20px", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
          <section style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div className="panel-card" style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px", marginBottom: 0 }}>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
                <button
                  onClick={() => { setAgentId(null); setAgentUrl(null); setAppState("INTAKE"); }}
                  style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.15)", color: "#f87171", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                >
                  ← Exit Consultation
                </button>

                <div style={{ display: "flex", background: "var(--surface2)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <button onClick={() => setConsultationMode("CHAT")} style={{ background: consultationMode === "CHAT" ? "var(--primary)" : "transparent", color: "white", border: "none", padding: "6px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                    Text Terminal Mode
                  </button>
                  <button onClick={() => handleConnectConsultation("VIDEO")} style={{ background: consultationMode === "VIDEO" ? "var(--primary)" : "transparent", color: "white", border: "none", padding: "6px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                    Live Video Mode
                  </button>
                </div>
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {consultationMode === "CHAT" ? (
                  <ChatPanel
                    agentId={agentId}
                    userProfile={userProfile}
                    initialIntakeSummary={{ symptoms: symptomBrief, severity, duration }}
                  />
                ) : (
                  <div className="video-container" style={{ flex: 1, minHeight: "460px" }}>
                    <VideoAgent
                      agentId={agentId}
                      agentUrl={agentUrl}
                      isLoading={isAgentLoading}
                      onLaunch={() => {}}
                      errorMessage={agentError}
                      intakeSummary={{ symptoms: symptomBrief, severity, duration }}
                      chatMessages={[]}
                    />
                  </div>
                )}
              </div>

            </div>
          </section>

          <aside style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="panel-card" style={{ padding: "16px", marginBottom: 0 }}>
              <h3 className="panel-title">Active Diagnostics Data</h3>
              <div style={{ background: "var(--surface2)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px" }}>
                <div style={{ color: "#38bdf8", fontWeight: "600", fontStyle: "italic", marginBottom: "10px" }}>
                  "{symptomBrief || "Routine checkup baseline profile track."}"
                </div>
                <div style={{ margin: "6px 0", borderTop: "1px solid var(--border)", paddingTop: "6px" }}>
                  <div style={{ marginBottom: "3px" }}>Language: <strong style={{ color: "white" }}>{LANGUAGES.find(l => l.code === selectedLang)?.label}</strong></div>
                  <div style={{ marginBottom: "3px" }}>Blood Group: <strong style={{ color: "white" }}>{userBloodGroup}</strong></div>
                  <div>Allergies: <strong style={{ color: "white" }}>{userAllergies}</strong></div>
                </div>
              </div>
            </div>

            <div className="panel-card" style={{ padding: "16px", marginBottom: 0 }}>
              <h3 className="panel-title"><span className="pulse" /> Telemetry</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div style={{ background: "var(--surface2)", padding: "8px", borderRadius: "6px", border: "1px solid var(--border)" }}><div style={{ fontSize: "10px", color: "var(--text-2)" }}>Pulse</div><div style={{ fontSize: "13px", fontWeight: "700", color: "#ef4444" }}>{Math.round(heartRate)} bpm</div></div>
                <div style={{ background: "var(--surface2)", padding: "8px", borderRadius: "6px", border: "1px solid var(--border)" }}><div style={{ fontSize: "10px", color: "var(--text-2)" }}>SpO₂</div><div style={{ fontSize: "13px", fontWeight: "700", color: "#38bdf8" }}>{Math.min(100, Math.round(spo2))}%</div></div>
                <div style={{ background: "var(--surface2)", padding: "8px", borderRadius: "6px", border: "1px solid var(--border)" }}><div style={{ fontSize: "10px", color: "var(--text-2)" }}>BP</div><div style={{ fontSize: "13px", fontWeight: "700", color: "#10b981" }}>{Math.round(systolic)}/{Math.round(diastolic)}</div></div>
                <div style={{ background: "var(--surface2)", padding: "8px", borderRadius: "6px", border: "1px solid var(--border)" }}><div style={{ fontSize: "10px", color: "var(--text-2)" }}>Temp</div><div style={{ fontSize: "13px", fontWeight: "700", color: "#f59e0b" }}>{temperature.toFixed(1)} °F</div></div>
              </div>
            </div>

            <div className="right-panel" style={{ flex: 1, marginBottom: 0 }}>
              <div className="tab-bar">
                {(["hospitals", "report"] as const).map((tab) => (
                  <button key={tab} className={`tab-btn ${activeTab === tab ? "tab-active" : ""}`} onClick={() => setActiveTab(tab)} style={{ padding: "12px 4px", fontSize: "12px" }}>
                    {tab === "hospitals" ? "Facilities Map" : "Reports Parsing"}
                  </button>
                ))}
              </div>
              <div className="tab-content">
                {activeTab === "hospitals" && <HospitalsPanel />}
                {activeTab === "report" && <ReportUpload />}
              </div>
            </div>
          </aside>
        </main>
      )}
    </div>
  );
}