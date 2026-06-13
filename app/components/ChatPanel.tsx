"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

interface Summary {
  chiefComplaint: string;
  keySymptoms: string[];
  recommendations: string[];
  followUp: string;
  urgency: "low" | "medium" | "high";
}

interface ChatProps {
  agentId: string | null;
  userProfile: { name: string };
  initialIntakeSummary: { symptoms: string; severity: string; duration: string };
}

const getTimestampString = () => {
  const d = new Date();
  return `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() >= 12 ? "PM" : "AM"}`;
};

export default function ChatPanel({ agentId, userProfile, initialIntakeSummary }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: "clinical-sync",
        role: "assistant",
        content: `Hello ${userProfile.name} 👋 I've reviewed your intake — "${initialIntakeSummary.symptoms || "General Evaluation"}" (${initialIntakeSummary.severity} severity, lasting ${initialIntakeSummary.duration}). How can I help you today?`,
        time: getTimestampString(),
      }
    ]);
  }, [userProfile.name]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const fireChatMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      time: getTimestampString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          intakeSummary: initialIntakeSummary,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: data.reply,
          time: getTimestampString(),
        },
      ]);
      if (data.summary) setSummary(data.summary);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Connection issue. Please try again.",
          time: getTimestampString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const urgencyColor = {
    low: "#22c55e",
    medium: "#f59e0b",
    high: "#ef4444",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      
      {/* Messages */}
      <div className="chat-messages" style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: "flex", flexDirection: "column" }}>
            <div className={`chat-bubble ${msg.role === "user" ? "bubble-user" : "bubble-ai"}`}>
              {msg.content}
            </div>
            <div className={`bubble-meta ${msg.role === "user" ? "bubble-user" : ""}`}>
              {msg.role === "user" ? "You" : "Dr. Lisa (MedLive AI)"} · {msg.time}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Consultation Summary — appears after 6 messages */}
      {summary && (
        <div style={{
          margin: "0 12px 12px",
          padding: "14px",
          background: "var(--surface2)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          fontSize: "13px",
          lineHeight: "1.6",
        }}>
          <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
            📋 Consultation Summary
            <span style={{
              marginLeft: "auto",
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 20,
              background: urgencyColor[summary.urgency] + "22",
              color: urgencyColor[summary.urgency],
              border: `1px solid ${urgencyColor[summary.urgency]}44`,
            }}>
              {summary.urgency.toUpperCase()} URGENCY
            </span>
          </div>

          <div style={{ marginBottom: 6 }}>
            <span style={{ fontWeight: 600 }}>Chief Complaint: </span>
            {summary.chiefComplaint}
          </div>

          {summary.keySymptoms.length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 600 }}>Key Symptoms: </span>
              {summary.keySymptoms.join(", ")}
            </div>
          )}

          {summary.recommendations.length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 600 }}>Recommendations:</span>
              <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                {summary.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginBottom: 6 }}>
            <span style={{ fontWeight: 600 }}>Follow-up: </span>
            {summary.followUp}
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-2)", borderTop: "1px solid var(--border)", paddingTop: 8 }}>
            ⚠️ AI summary only — not a medical diagnosis. Please consult a licensed doctor.
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: "12px",
        display: "flex",
        gap: "8px",
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
      }}>
        <input
          type="text"
          className="chat-input"
          style={{
            flex: 1,
            background: "var(--surface2)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            padding: "12px 16px",
            outline: "none",
            fontSize: "13px",
          }}
          placeholder="Describe your symptoms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") fireChatMessage(input); }}
        />
        <button
          className="send-btn"
          onClick={() => fireChatMessage(input)}
          disabled={!input.trim() || isTyping}
        >
          ➤
        </button>
      </div>
    </div>
  );
}