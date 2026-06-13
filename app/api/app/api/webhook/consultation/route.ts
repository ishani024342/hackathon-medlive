import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log("=== CONSULTATION STARTED ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Patient:", body.patientName);
    console.log("Email:", body.email);
    console.log("Mode:", body.consultationMode);
    console.log("Symptoms:", body.symptoms);
    console.log("Severity:", body.severity);
    console.log("Duration:", body.duration);
    console.log("Language:", body.language);
    console.log("===========================");

    return NextResponse.json({ 
      received: true, 
      timestamp: new Date().toISOString(),
      event: "consultation_started"
    });
  } catch (err) {
    console.error("Consultation webhook error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}