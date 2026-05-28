"use client";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    window.location.replace("/");
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #e0f2fe 0%, #f0f4f8 50%, #ecfdf5 100%)",
      fontFamily: "DM Sans, sans-serif",
    }}>
      <div style={{
        background: "white", borderRadius: 20, padding: 40, width: 380,
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: "0 auto 12px",
            background: "linear-gradient(135deg, #0ea5e9, #10b981)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
          }}>🩺</div>
          <h1 style={{
            fontFamily: "Syne, sans-serif", fontSize: 26, fontWeight: 800, margin: 0,
            background: "linear-gradient(135deg, #0ea5e9, #10b981)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>MedLive</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Your AI Healthcare Assistant</p>
        </div>

        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10,
            padding: "10px 14px", color: "#dc2626", fontSize: 13, marginBottom: 16,
          }}>⚠️ {error}</div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Email</label>
          <input
            type="email" value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="you@example.com"
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 10,
              border: "1px solid #e2e8f0", fontSize: 14, outline: "none",
              fontFamily: "DM Sans, sans-serif", boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Password</label>
          <input
            type="password" value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
            placeholder="••••••••"
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 10,
              border: "1px solid #e2e8f0", fontSize: 14, outline: "none",
              fontFamily: "DM Sans, sans-serif", boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          style={{
            width: "100%", padding: "13px", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg, #0ea5e9, #10b981)",
            color: "white", fontSize: 15, fontWeight: 600,
            cursor: "pointer", fontFamily: "Syne, sans-serif",
          }}
        >Sign In →</button>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", margin: "16px 0 0" }}>
          Demo mode — any credentials work
        </p>
      </div>
    </div>
  );
}
