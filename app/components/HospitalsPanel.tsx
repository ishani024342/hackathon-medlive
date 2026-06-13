"use client";

import { useState } from "react";

const HOSPITALS = [
  { 
    id: 1, 
    name: "Medanta – The Medicity", 
    dist: "2.1 km", 
    wait: "15 min", 
    rating: 5,
    specialties: ["Cardiology", "Oncology"],
    phone: "01244141414",
    address: "Medanta The Medicity, Sector 38, Gurugram, Haryana 122001"
  },
  { 
    id: 2, 
    name: "Fortis Memorial Research Institute", 
    dist: "3.4 km", 
    wait: "25 min", 
    rating: 4,
    specialties: ["Neurology", "Orthopaedics"],
    phone: "01244921021",
    address: "Fortis Hospital, Sector 44, Gurugram, Haryana 122002"
  },
  { 
    id: 3, 
    name: "Max Super Speciality Hospital", 
    dist: "4.8 km", 
    wait: "30 min", 
    rating: 4,
    specialties: ["Emergency", "Paediatrics"],
    phone: "01244192000",
    address: "Max Hospital, Sushant Lok 1, Gurugram, Haryana 122001"
  }
];

export default function HospitalsPanel() {
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null);

  const handleEmergencyCall = () => {
    window.location.href = "tel:112";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div className="hospitals-list" style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {HOSPITALS.map((h) => {
          const isSelected = selectedHospitalId === h.id;
          const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(h.address)}`;

          return (
            <div 
              key={h.id} 
              className="hospital-card"
              onClick={() => setSelectedHospitalId(h.id)}
              style={{
                cursor: "pointer",
                transition: "all 0.2s ease",
                border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border)",
                background: isSelected ? "rgba(14, 165, 233, 0.04)" : "var(--surface2)",
                padding: "14px",
                borderRadius: "10px",
                marginBottom: "12px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div className="hospital-name" style={{ fontWeight: 600, color: "white", fontSize: "14px" }}>
                  {h.name}
                </div>
                {isSelected && (
                  <span style={{ color: "var(--primary)", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>
                    Selected
                  </span>
                )}
              </div>

              <div style={{ margin: "4px 0 8px 0" }}>
                {"★".repeat(h.rating)}{"☆".repeat(5 - h.rating)}
              </div>

              <div className="hospital-meta" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                {h.specialties.map((s) => (
                  <span key={s} className="hospital-tag">{s}</span>
                ))}
                <span className="hospital-tag" style={{ color: "#10b981", background: "rgba(16, 185, 129, 0.08)" }}>⏱ {h.wait}</span>
                <span className="hospital-tag" style={{ color: "var(--text-2)" }}>📍 {h.dist}</span>
              </div>

              <div style={{ display: "flex", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                <a 
                  href={mapsDirectionsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ flex: 1, textDecoration: "none" }}
                >
                  <button 
                    className="btn-sm btn-primary" 
                    style={{ 
                      width: "100%", 
                      padding: "8px", 
                      borderRadius: "6px", 
                      background: "var(--primary)", 
                      color: "white", 
                      border: "none",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    🗺 Directions
                  </button>
                </a>
                <a href={`tel:${h.phone}`} style={{ flex: 1, textDecoration: "none" }}>
                  <button 
                    className="btn-sm btn-outline" 
                    style={{ 
                      width: "100%", 
                      padding: "8px", 
                      borderRadius: "6px", 
                      background: "transparent", 
                      color: "var(--text-2)", 
                      border: "1px solid var(--border)",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    📞 Call
                  </button>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        className="emergency-btn" 
        onClick={handleEmergencyCall}
        style={{
          width: "calc(100% - 32px)",
          padding: "14px",
          margin: "16px",
          marginTop: "4px",
          background: "linear-gradient(135deg, #ef4444, #b91c1c)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          letterSpacing: "0.05em"
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 16, height: 16 }}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        </svg>
        🚨 INITIATE EMERGENCY CALL — 112
      </button>
    </div>
  );
}