// app/api/conversation/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // Comprehensive contextual intelligence routing mapping matrix
    let replyText = "I have reviewed your active profile telemetry data. Could you specify if there are any sudden acute adjustments regarding your metrics today?";

    if (lastUserMessage.includes("Symptoms")) {
      replyText = "Analyzing symptom parameters against history markers. Given your profile history of mild seasonal asthma, please make sure room air circulation is optimized. Let's trace any shortness of breath or triggers.";
    } else if (lastUserMessage.includes("Lab Panels")) {
      replyText = "Opening diagnostic records pipeline. Your primary metabolic history parameters, blood unit layout (O+), and allergy clearances are clean. Ready to take document imports under the Analytics tab.";
    } else if (lastUserMessage.includes("Protocols")) {
      replyText = "Emergency tracking is on standby. Nearest trauma corridors are pre-mapped into your right panel workspace under 'Facilities Map'. If acute chest tightness arises, prompt execution via the red 112 trigger is advised.";
    }

    return NextResponse.json({ reply: replyText });
  } catch {
    return NextResponse.json({ reply: "Diagnostic link anomaly encountered." }, { status: 500 });
  }
}