// app/api/agent/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const profile = body.userProfile || { name: "Ishani Sharma" };
    const intake = body.intakeData || { symptoms: "General Checkup", severity: "Mild", duration: "1 Day" };
    
    // Inject custom intake brief directly into the system prompt structure
    const advancedClinicalPrompt = `You are Dr. Lisa, an expert medical avatar companion. 
Patient: ${profile.name}.
Active Intake Report: Symptoms logged by patient before connecting: "${intake.symptoms}", categorized as ${intake.severity} status over ${intake.duration}.
Do not ask them what their symptoms are or ask them to repeat themselves. Acknowledge what they wrote in their intake form immediately and begin your clinical assessment or supportive advice right away.`;

    const res = await fetch("https://api.trugen.ai/v1/ext/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.TRUGEN_API_KEY!,
      },
      body: JSON.stringify({
        agent_name: "MedLive Connected Clinic",
        agent_system_prompt: advancedClinicalPrompt,
        config: { timeout: 240 },
        user: { name: profile.name, email: profile.email },
        avatars: [{
          avatar_key_id: "665a1170",
          config: {
            llm: { model: "meta-llama/llama-4-maverick-17b-128e-instruct", provider: "groq" },
            stt: { model: "flux-general-en", provider: "deepgram" },
            tts: { model_id: "eleven_turbo_v2_5", provider: "elevenlabs" }
          }
        }],
        record: false,
      }),
    });

    const rawText = await res.text();
    if (!res.ok) return NextResponse.json({ error: "TruGen failed to instantiate room." }, { status: 500 });
    
    const data = JSON.parse(rawText);
    const customizedEmbedUrl = `https://app.trugen.ai/embed/${data.id}?name=${encodeURIComponent(profile.name)}&email=${encodeURIComponent(profile.email)}&autostart=true`;
    
    return NextResponse.json({ id: data.id, url: customizedEmbedUrl });
  } catch (err) {
    return NextResponse.json({ error: "Internal Gateway Routing Fault" }, { status: 500 });
  }
}