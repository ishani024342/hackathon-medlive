// app/components/ChatPanel.tsx
"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Instantly greet with complete awareness of what the patient submitted in the portal step
    setMessages([
      {
        id: "clinical-sync",
        role: "assistant",
        content: `Secure connection initialized. Hello ${userProfile.name}, I have carefully reviewed your logged report description regarding: "${initialIntakeSummary.symptoms || "General Evaluation"}" (${initialIntakeSummary.severity} status, lasting ${initialIntakeSummary.duration}). I've synchronized this into your active chart history. Let's look closer at your treatment plan. How can I best guide you right now?`,
        time: getTimestampString(),
      }
    ]);
  }, [userProfile.name]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const fireChatMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, time: getTimestampString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: data.reply, time: getTimestampString() }]);
    } catch {
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: "Signal fault detected. Resyncing chat corridor...", time: getTimestampString() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Messages Window */}
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
          <div className="typing-indicator"><div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" /></div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Box */}
      <div style={{ padding: "12px", display: "flex", gap: "8px", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <input
          type="text"
          className="chat-input"
          style={{ flex: 1, background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "20px", padding: "12px 16px", outline: "none", fontSize: "13px" }}
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") fireChatMessage(input); }}
        />
        <button className="send-btn" onClick={() => fireChatMessage(input)} disabled={!input.trim() || isTyping}>
          ➤
        </button>
      </div>
    </div>
  );
}