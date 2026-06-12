import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English", hi: "Hindi", ta: "Tamil",
  te: "Telugu", bn: "Bengali", mr: "Marathi",
};

export async function POST(req: NextRequest) {
  try {
    const { symptoms, severity, duration, lang = "en" } = await req.json();
    const languageName = LANGUAGE_NAMES[lang] || "English";

    if (!symptoms || symptoms.length === 0) {
      return NextResponse.json({ error: "No symptoms provided" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Patient reports symptoms: ${symptoms.join(", ")}.
Severity: ${severity}/10. Duration: ${duration} days.

Provide a triage assessment in ${languageName}. Return ONLY valid JSON (no markdown, no extra text):
{
  "urgency": "Low" | "Medium" | "High" | "Emergency",
  "urgencyColor": "#10b981" | "#f59e0b" | "#f97316" | "#ef4444",
  "likelyCauses": ["cause1", "cause2", "cause3"],
  "immediateActions": ["action1", "action2"],
  "doctorAdvice": "When and what type of doctor to see",
  "redFlags": ["flag1"]
}

Rules: urgencyColor must match urgency level (Low=green, Medium=yellow, High=orange, Emergency=red).
All text fields must be in ${languageName}.`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "{}";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({ assessment: parsed });
  } catch (err) {
    console.error("Symptom checker error:", err);
    return NextResponse.json(
      { error: "Could not analyze symptoms. Please try again." },
      { status: 500 }
    );
  }
}