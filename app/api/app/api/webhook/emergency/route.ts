import { NextRequest, NextResponse } from "next/server";

const EMERGENCY_KEYWORDS = [
  "chest pain", "heart attack", "stroke", "can't breathe",
  "cannot breathe", "difficulty breathing", "unconscious",
  "severe bleeding", "seizure", "overdose", "suicide"
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const detectedKeywords = EMERGENCY_KEYWORDS.filter(kw =>
      body.message?.toLowerCase().includes(kw)
    );

    console.log("🚨 === EMERGENCY ALERT === 🚨");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Patient:", body.patientName);
    console.log("Email:", body.email);
    console.log("Message:", body.message);
    console.log("Detected Keywords:", detectedKeywords.join(", "));
    console.log("Severity:", body.severity);
    console.log("=========================");

    return NextResponse.json({
      received: true,
      timestamp: new Date().toISOString(),
      event: "emergency_detected",
      keywords: detectedKeywords,
      requiresImmediate: true
    });
  } catch (err) {
    console.error("Emergency webhook error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}