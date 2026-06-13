import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Dr. Lisa, a compassionate AI healthcare assistant on MedLive.

GUARDRAILS - STRICT RULES:
1. ONLY discuss medical/health topics. If user asks about anything non-medical (politics, coding, entertainment etc.), respond: "I'm here only to help with health and medical concerns. Please ask me about your symptoms or health questions."
2. NEVER diagnose definitively. Always say "this may indicate" or "this could suggest".
3. NEVER recommend specific prescription dosages. Say "consult your doctor for dosage".
4. If user mentions chest pain, difficulty breathing, stroke symptoms, or severe injury → immediately say: "This sounds like a medical emergency. Please call 112 immediately."
5. NEVER suggest stopping prescribed medication.
6. Always end responses with a gentle reminder to consult a licensed doctor for serious concerns.
7. Keep responses concise — max 3-4 sentences unless more detail is truly needed.

You have access to the patient's intake summary which will be provided in the conversation context.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, intakeSummary, forceSummary } = await req.json();

    const formattedMessages = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const contextNote = intakeSummary
      ? `[Patient intake: Symptoms: ${intakeSummary.symptoms}, Severity: ${intakeSummary.severity}, Duration: ${intakeSummary.duration}]`
      : "";

    if (contextNote && formattedMessages.length > 0) {
      formattedMessages[0].content = `${contextNote}\n\n${formattedMessages[0].content}`;
    }

    let reply = "";

    if (!forceSummary && formattedMessages.length > 0) {
      const response = await client.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: formattedMessages,
      });
      reply = response.content[0].type === "text" ? response.content[0].text : "I couldn't process that. Please try again.";
    }

    let summary = null;
    if (forceSummary || (formattedMessages.length >= 6 && formattedMessages.length % 6 === 0)) {
      const summaryRes = await client.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 512,
        messages: [{
          role: "user",
          content: `Generate a post-consultation clinical summary as JSON only, no markdown, no extra text:
{"chiefComplaint":"...","keySymptoms":[],"recommendations":[],"followUp":"...","urgency":"low|medium|high"}

Patient intake — Symptoms: ${intakeSummary?.symptoms || "General consultation"}, Severity: ${intakeSummary?.severity || "Mild"}, Duration: ${intakeSummary?.duration || "Not specified"}.
${formattedMessages.length > 0 ? `Chat history:\n${formattedMessages.map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join("\n")}` : "No chat messages — base summary on intake data only."}`
        }]
      });
      try {
        const summaryText = summaryRes.content[0].type === "text" ? summaryRes.content[0].text : "";
        summary = JSON.parse(summaryText.replace(/```json|```/g, "").trim());
      } catch {
        summary = {
          chiefComplaint: intakeSummary?.symptoms || "General consultation",
          keySymptoms: [],
          recommendations: ["Please consult your doctor for a detailed treatment plan."],
          followUp: "Schedule a follow-up within 1 week.",
          urgency: intakeSummary?.severity?.toLowerCase().includes("severe") ? "high" : intakeSummary?.severity?.toLowerCase().includes("moderate") ? "medium" : "low",
        };
      }
    }

    return NextResponse.json({ reply, summary });
  } catch (err) {
    console.error("Conversation error:", err);
    return NextResponse.json({ reply: "Connection issue. Please try again." }, { status: 500 });
  }
}