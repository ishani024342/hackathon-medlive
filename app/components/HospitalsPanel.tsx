"use client";

import { useState, useEffect } from "react";

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
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [copied, setCopied] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (showEmergencyModal) {
      setPulse(true);
      setLocationLoading(true);
      setLocation(null);
      setLocationError("");

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            const address = data.display_name || "Location detected";
            setLocation({ lat: latitude, lng: longitude, address });
          } catch {
            setLocation({ lat: latitude, lng: longitude, address: "Location detected" });
          }
          setLocationLoading(false);
        },
        () => {
          setLocationError("Location access denied. Share your location manually.");
          setLocationLoading(false);
        },
        { timeout: 8000 }
      );
    }
  }, [showEmergencyModal]);

  const handleCopyLocation = () => {
    if (!location) return;
    const text = `EMERGENCY LOCATION: ${location.lat.toFixed(6)}° N, ${location.lng.toFixed(6)}° E\nAddress: ${location.address}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", position: "relative" }}>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.92)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "12px"
        }}>
          <div style={{
            background: "#110505",
            border: `2px solid ${pulse ? "#ef4444" : "#7f1d1d"}`,
            borderRadius: "16px", padding: "24px", width: "88%",
            textAlign: "center",
            boxShadow: "0 0 60px #ef444444",
            transition: "border-color 0.5s ease"
          }}>
            {/* Header */}
            <div style={{
              fontSize: 36, marginBottom: 4,
              animation: "pulse 1s infinite"
            }}>🚨</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#ef4444", letterSpacing: 2, marginBottom: 2 }}>
              EMERGENCY ALERT
            </div>
            <div style={{ fontSize: 11, color: "var(--text-2)", marginBottom: 16 }}>
              National Emergency Helpline
            </div>

            {/* Big Number */}
            <div style={{
              fontSize: 52, fontWeight: 900, color: "white",
              letterSpacing: 6, marginBottom: 16,
              textShadow: "0 0 30px #ef444488",
              fontFamily: "monospace"
            }}>
              112
            </div>

            {/* Location Box */}
            <div style={{
              background: "#1a0a0a", border: "1px solid #ef444433",
              borderRadius: "10px", padding: "12px", marginBottom: 14, textAlign: "left"
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                📍 Your Emergency Location
              </div>

              {locationLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-2)", fontSize: 12 }}>
                  <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                  <span>Detecting location...</span>
                </div>
              )}

              {location && !locationLoading && (
                <>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 4, fontFamily: "monospace" }}>
                    {location.lat.toFixed(5)}° N, {location.lng.toFixed(5)}° E
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-2)", marginBottom: 10, lineHeight: 1.4 }}>
                    {location.address.split(",").slice(0, 4).join(",")}
                  </div>
                  <button
                    onClick={handleCopyLocation}
                    style={{
                      width: "100%", padding: "8px",
                      background: copied ? "#166534" : "#1e3a5f",
                      border: `1px solid ${copied ? "#22c55e" : "#0ea5e9"}`,
                      color: copied ? "#22c55e" : "#38bdf8",
                      borderRadius: "6px", fontSize: 11, fontWeight: 700,
                      cursor: "pointer", transition: "all 0.2s"
                    }}
                  >
                    {copied ? "✓ COPIED TO CLIPBOARD" : "📋 COPY LOCATION FOR DISPATCHER"}
                  </button>
                </>
              )}

              {locationError && (
                <div style={{ fontSize: 11, color: "#f87171" }}>{locationError}</div>
              )}
            </div>

            {/* Call Button */}
            <a href="tel:112" style={{ textDecoration: "none", display: "block", marginBottom: 10 }}>
              <button style={{
                width: "100%", padding: "14px",
                background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                color: "white", border: "none", borderRadius: "10px",
                fontSize: 15, fontWeight: 900, cursor: "pointer",
                letterSpacing: 1, boxShadow: "0 4px 20px #ef444466"
              }}>
                📞 TAP TO CALL 112
              </button>
            </a>

            <div style={{ fontSize: 11, color: "var(--text-2)", marginBottom: 14 }}>
              On desktop — dial <strong style={{ color: "white" }}>112</strong> from your mobile immediately
            </div>

            {/* Nearest Hospitals */}
            <div style={{ borderTop: "1px solid #ef444422", paddingTop: 14, marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "var(--text-2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                Nearest Emergency Hospitals
              </div>
              {HOSPITALS.map(h => (
                <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 12, color: "white", fontWeight: 600 }}>{h.name}</div>
                    <div style={{ fontSize: 10, color: "var(--text-2)" }}>{h.dist} away</div>
                  </div>
                  <a href={`tel:${h.phone}`} style={{ textDecoration: "none" }}>
                    <button style={{
                      padding: "5px 12px", background: "transparent",
                      border: "1px solid #ef444466", color: "#ef4444",
                      borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer"
                    }}>
                      Call
                    </button>
                  </a>
                </div>
              ))}
            </div>

            {/* Close */}
            <button
              onClick={() => { setShowEmergencyModal(false); setPulse(false); }}
              style={{
                width: "100%", padding: "10px",
                background: "transparent", border: "1px solid var(--border)",
                color: "var(--text-2)", borderRadius: "8px",
                fontSize: 12, cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hospitals List */}
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
                cursor: "pointer", transition: "all 0.2s ease",
                border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border)",
                background: isSelected ? "rgba(14, 165, 233, 0.04)" : "var(--surface2)",
                padding: "14px", borderRadius: "10px", marginBottom: "12px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontWeight: 600, color: "white", fontSize: "14px" }}>{h.name}</div>
                {isSelected && (
                  <span style={{ color: "var(--primary)", fontSize: "11px", fontWeight: "bold" }}>Selected</span>
                )}
              </div>

              <div style={{ margin: "4px 0 8px 0" }}>
                {"★".repeat(h.rating)}{"☆".repeat(5 - h.rating)}
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                {h.specialties.map((s) => (
                  <span key={s} className="hospital-tag">{s}</span>
                ))}
                <span className="hospital-tag" style={{ color: "#10b981", background: "rgba(16, 185, 129, 0.08)" }}>⏱ {h.wait}</span>
                <span className="hospital-tag" style={{ color: "var(--text-2)" }}>📍 {h.dist}</span>
              </div>

              <div style={{ display: "flex", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textDecoration: "none" }}>
                  <button style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "var(--primary)", color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}>
                    🗺 Directions
                  </button>
                </a>
                <a href={`tel:${h.phone}`} style={{ flex: 1, textDecoration: "none" }}>
                  <button style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "transparent", color: "var(--text-2)", border: "1px solid var(--border)", fontWeight: 600, cursor: "pointer" }}>
                    📞 Call
                  </button>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Button */}
      <button
        onClick={() => setShowEmergencyModal(true)}
        style={{
          width: "calc(100% - 32px)", padding: "14px",
          margin: "16px", marginTop: "4px",
          background: "linear-gradient(135deg, #ef4444, #b91c1c)",
          color: "white", border: "none", borderRadius: "8px",
          fontSize: "13px", fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "8px", letterSpacing: "0.05em",
          boxShadow: "0 4px 15px #ef444433"
        }}
      >
        🚨 INITIATE EMERGENCY CALL — 112
      </button>
    </div>
  );
}