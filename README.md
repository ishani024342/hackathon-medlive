# 🩺 MedLive — Real-Time Healthcare AI Agent

> **Hack Days Delhi 2026 · Round 2 Submission**  
> Track: Real-Time Video AI Agent using TruGen AI  
> Team: [Your Team Name]

---

## 🚀 Live Demo

> Deploy to Vercel in 1 click:  
> [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 📌 Problem Statement

Healthcare access in India is unequal. Millions of patients:
- Can't afford specialist consultations
- Don't understand their lab reports
- Waste hours finding the right hospital
- Face language and literacy barriers

**MedLive bridges this gap** with a real-time AI video agent that acts as a first-responder healthcare companion — available 24/7, empathetic, and powered by clinical intelligence.

---

## 💡 Solution

**MedLive** is a real-time video AI healthcare agent built on **TruGen AI** that:

| Feature | Description |
|--------|-------------|
| 🎥 **Live Video Consultation** | Face-to-face AI consultation via TruGen's Huma-1 avatar model |
| 🗣️ **Symptom Assessment** | Collects structured symptom data (onset, severity, location) in real time |
| 📋 **Report Analysis** | Upload PDFs/images of lab reports — Claude AI explains them in plain language |
| 💬 **AI Health Chat** | Text-based health Q&A powered by Claude for asynchronous queries |
| 🏥 **Nearby Hospitals** | Live hospital finder with wait times, specialties, and one-tap directions |
| 🚨 **Emergency Protocol** | Instant 112 escalation with location-based hospital routing |

---

## 🏗️ Architecture

```
User (Browser)
     │
     ▼
┌──────────────────────────────────────────┐
│         Next.js Frontend (React)          │
│  VideoAgent │ ChatPanel │ ReportUpload    │
│  HospitalsPanel │ VitalsMonitor           │
└────────────┬─────────────────────────────┘
             │  API Routes (Next.js)
     ┌───────┼───────────┐
     ▼       ▼           ▼
TruGen AI  Anthropic   Google Maps
  API      Claude API    API
  │          │
  │  POST /v1/agent/api
  │  → Creates avatar agent
  │  → Embeds via iframe
  │
  └── Huma-1 (Avatar Model)
  └── Hawkeye-1 (Vision Model)
```

### Data Flow

1. **User opens MedLive** → Next.js app loads
2. **"Start Consultation"** → `POST /api/agent` → TruGen creates agent, returns `agentId`
3. **TruGen iframe embeds** → User sees lifelike avatar, camera/mic activates
4. **User speaks/types symptoms** → TruGen processes speech → Avatar responds in <1s
5. **User uploads report** → `POST /api/report-analyze` → Claude reads PDF/image → returns plain-English summary
6. **User asks text question** → `POST /api/conversation` → Claude responds with health guidance
7. **User needs hospital** → `GET /api/hospitals` → Returns nearby hospitals with directions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, CSS (custom glassmorphism) |
| Video AI | **TruGen AI** (Huma-1 avatar + Hawkeye-1 vision) |
| Chat AI | **Anthropic Claude** (claude-sonnet-4) |
| Report AI | **Anthropic Claude** (vision + document API) |
| Hospitals | Google Maps Places API (or mock data) |
| Deployment | Vercel (Edge runtime) |

---

## 🔧 External Tool Integrations (MCP/APIs)

```
Agent Tools:
├── findNearbyHospitals(lat, lng, specialty)
│     → Google Maps Places API
├── analyzeReport(fileBase64, mimeType)
│     → Anthropic Claude Vision
├── checkSymptoms(symptoms[], age, gender)
│     → Claude with medical knowledge base
└── lookupMedication(name)
      → OpenFDA API
```

---

## ⚡ Quickstart

```bash
# 1. Clone
git clone https://github.com/YOUR_REPO/medlive
cd medlive

# 2. Install
npm install

# 3. Configure
cp .env.local.example .env.local
# Add TRUGEN_API_KEY + ANTHROPIC_API_KEY

# 4. Run
npm run dev
# → http://localhost:3000
```

---

## 📁 Project Structure

```
medlive/
├── app/
│   ├── page.tsx              # Main dashboard layout
│   ├── layout.tsx            # Root layout + metadata
│   ├── globals.css           # Design system + styles
│   ├── components/
│   │   ├── Header.tsx        # App header + branding
│   │   ├── VideoAgent.tsx    # TruGen AI iframe embed
│   │   ├── ChatPanel.tsx     # AI health chat (Claude)
│   │   ├── HospitalsPanel.tsx# Nearby hospitals finder
│   │   └── ReportUpload.tsx  # Medical report analyzer
│   └── api/
│       ├── agent/route.ts    # POST: create TruGen agent
│       ├── conversation/route.ts # POST: Claude health chat
│       ├── report-analyze/route.ts # POST: analyze report
│       └── hospitals/route.ts    # GET: nearby hospitals
├── .env.local.example
├── package.json
└── README.md
```

---

## 🎯 Real-World Impact

- **Accessibility**: Replaces costly first consultations for 500M+ underserved Indians
- **Speed**: <1 second response latency (TruGen AI benchmark)
- **Privacy**: No data stored; all conversations end-to-end
- **Multilingual**: TruGen supports Hindi, Tamil, Telugu (expandable)
- **24/7 Availability**: No appointment needed

---

## 🔮 Future Roadmap

- [ ] Wearable integration (Apple Watch, Fitbit) for live vitals
- [ ] EHR (Electronic Health Record) sync via FHIR API
- [ ] Prescription generation workflow (human-in-loop)
- [ ] Specialist video handoff (TruGen → real doctor)
- [ ] Voice support in 12 Indian languages

---

## ⚠️ Disclaimer

MedLive is an AI assistant, not a licensed medical device. It does not diagnose conditions or prescribe treatments. Always consult a qualified healthcare professional for medical decisions.

---

## 👥 Team

| Name |
|------|
| [Ishani Sharma] | 
| [Ishika Sharma] |
| [Tanishi Agrawal] | 

---

*Built with ❤️ for Hack Days Delhi 2026*
