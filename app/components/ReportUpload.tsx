"use client";

import { useState, useRef } from "react";

export default function ReportUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    setFile(f);
    setResult(null);
    setAnalyzing(true);
    setProgress(0);

    for (let i = 10; i <= 80; i += 10) {
      await new Promise((r) => setTimeout(r, 120));
      setProgress(i);
    }

    try {
      const formData = new FormData();
      formData.append("file", f);
      const res = await fetch("/api/report-analyze", { method: "POST", body: formData });
      const data = await res.json();
      setProgress(100);
      setResult(data.summary);
    } catch {
      setResult("Could not analyze the file. Please try again.");
      setProgress(100);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="report-area">
      <div
        className={`dropzone ${dragOver ? "drag-over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => inputRef.current?.click()}
      >
        <div className="dropzone-icon">📋</div>
        <h4>Upload Medical Report</h4>
        <p>Drag & drop or click to upload<br />PDF, JPG, PNG supported</p>
        <button className="upload-btn" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
          Browse Files
        </button>
        <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>

      {file && <div className="file-name">📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)</div>}

      {analyzing && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 6 }}>🤖 Analyzing with AI…</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {result && !analyzing && (
        <div className="report-result">
          <h4>🔍 AI Analysis Summary</h4>
          <p>{result}</p>
          <p style={{ marginTop: 10, fontSize: 12, color: "#166534", opacity: 0.7 }}>
            ⚠️ This is an AI summary, not medical advice. Consult a licensed doctor.
          </p>
        </div>
      )}
    </div>
  );
}
