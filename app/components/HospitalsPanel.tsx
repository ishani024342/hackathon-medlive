"use client";

const HOSPITALS = [
  { id: 1, name: "Medanta – The Medicity", dist: "2.1 km", wait: "~15 min", rating: 4.8, specialties: ["Cardiology", "Oncology"], phone: "0124-4141414", maps: "https://maps.google.com/?q=Medanta+Gurugram" },
  { id: 2, name: "Fortis Memorial Research", dist: "3.4 km", wait: "~25 min", rating: 4.7, specialties: ["Neurology", "Ortho"], phone: "0124-4921021", maps: "https://maps.google.com/?q=Fortis+Gurugram" },
  { id: 3, name: "Max Super Speciality", dist: "4.8 km", wait: "~30 min", rating: 4.6, specialties: ["Emergency", "Paediatrics"], phone: "0124-4192000", maps: "https://maps.google.com/?q=Max+hospital+Gurugram" },
  { id: 4, name: "Paras Hospitals", dist: "5.2 km", wait: "~20 min", rating: 4.5, specialties: ["Dermatology", "ENT"], phone: "0124-4585555", maps: "https://maps.google.com/?q=Paras+Hospitals+Gurugram" },
];

function Stars({ n }: { n: number }) {
  return <span style={{ color: "#f59e0b", fontSize: 12 }}>{"★".repeat(Math.round(n))}{"☆".repeat(5 - Math.round(n))} {n}</span>;
}

export default function HospitalsPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <div className="hospitals-list">
        {HOSPITALS.map((h) => (
          <div key={h.id} className="hospital-card">
            <div className="hospital-name">{h.name}</div>
            <Stars n={h.rating} />
            <div className="hospital-meta">
              {h.specialties.map((s) => <span key={s} className="hospital-tag">{s}</span>)}
              <span className="hospital-wait">⏱ {h.wait}</span>
              <span className="hospital-dist">📍 {h.dist}</span>
            </div>
            <div className="hospital-actions">
              <a href={h.maps} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }}>
                <button className="btn-sm btn-primary" style={{ width: "100%" }}>🗺 Directions</button>
              </a>
              <a href={`tel:${h.phone}`} style={{ flex: 1 }}>
                <button className="btn-sm btn-outline" style={{ width: "100%" }}>📞 Call</button>
              </a>
            </div>
          </div>
        ))}
      </div>
      <button className="emergency-btn" onClick={() => window.open("tel:112")}>
        🚨 EMERGENCY — CALL 112
      </button>
    </div>
  );
}
