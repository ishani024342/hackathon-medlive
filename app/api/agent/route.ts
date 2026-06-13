// app/api/agent/route.ts
import { NextResponse } from "next/server";

// Dynamic configuration dictionary mapping codes to TruGen voice models
const LANGUAGE_CONFIGS: Record<string, { model: string; voiceId: string; promptLang: string; welcome: string }> = {
  en: {
    model: "flux-general-en",
    voiceId: "ZUrEGyu8GFMwnHbvLhv2",
    promptLang: "English",
    welcome: "Hi! I'm Dr. MedLive. I've reviewed your intake form. How can I help you today?"
  },
  hi: {
    model: "flux-general-hi", // Switches STT engine to Hindi
    voiceId: "ZUrEGyu8GFMwnHbvLhv2", // Uses a high-quality multilingual model architecture
    promptLang: "Hindi",
    welcome: "नमस्ते! मैं डॉक्टर मेडलाइव हूँ। मैंने आपका फॉर्म देख लिया है। आज मैं आपकी क्या सहायता कर सकती हूँ?"
  },
  ta: {
    model: "flux-general-ta", // Switches STT engine to Tamil
    voiceId: "ZUrEGyu8GFMwnHbvLhv2",
    promptLang: "Tamil",
    welcome: "வணக்கம்! நான் டாக்டர் மெட்லைவ். உங்கள் படிவத்தை நான் சரிபார்த்துள்ளேன். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?"
  },
  te: {
    model: "flux-general-te", // Switches STT engine to Telugu
    voiceId: "ZUrEGyu8GFMwnHbvLhv2",
    promptLang: "Telugu",
    welcome: "నమస్తే! నేను డాక్టర్ మెడ్‌లైవ్. నేను మీ ఇన్టేక్ ఫారమ్‌ను పరిశీలించాను. ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?"
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const profile = body.userProfile || { name: "Ishani Sharma" };
    const langCode = body.languageCode || "en";
    const intake = body.intakeData || { symptoms: "General Checkup", severity: "Mild", duration: "1 Day" };

    // Fall back gracefully if an unmapped locale code is provided
    const selectedTrack = LANGUAGE_CONFIGS[langCode] || LANGUAGE_CONFIGS.en;
    
    // Dynamically instruct the LLM to reply strictly in the patient's language track
    const optimizedClinicalPrompt = `You are Dr. Lisa, a compassionate medical avatar assistant. 
Patient Identity: ${profile.name}.
Active Complaint Logged: "${intake.symptoms}" with a ${intake.severity} status lasting ${intake.duration}.
CRITICAL LANGUAGE CONSTRAINT: The patient has requested to speak exclusively in ${selectedTrack.promptLang}. You must listen, evaluate, and talk entirely back in ${selectedTrack.promptLang}. Acknowledge their pre-submitted intake symptoms right away in their language.`;

    const res = await fetch("https://api.trugen.ai/v1/ext/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.TRUGEN_API_KEY!,
      },
      body: JSON.stringify({
        agent_name: `MedLive Clinic - ${selectedTrack.promptLang}`,
        agent_system_prompt: optimizedClinicalPrompt,
        config: { timeout: 240 },
        user: { name: profile.name, email: profile.email },
        avatars: [{
          avatar_key_id: "665a1170",
          config: {
            llm: { model: "meta-llama/llama-4-maverick-17b-128e-instruct", provider: "groq" },
            stt: { model: selectedTrack.model, provider: "deepgram", min_endpointing_delay: 0.3, max_endpointing_delay: 0.4 }, // Dynamic locale model
            tts: { model_id: "eleven_turbo_v2_5", provider: "elevenlabs", voice_id: selectedTrack.voiceId }, // Multilingual speech generation
          },
          welcome_message: {
            wait_time: 2,
            messages: [selectedTrack.welcome], // Welcome greeting in the patient's language
          },
        }],
        record: false,
      }),
    });

    const rawText = await res.text();
    if (!res.ok) {
      return NextResponse.json({ error: "TruGen initialization failed", detail: rawText }, { status: 500 });
    }
    
    const data = JSON.parse(rawText);
    const customizedEmbedUrl = `https://app.trugen.ai/embed/${data.id}?name=${encodeURIComponent(profile.name)}&email=${encodeURIComponent(profile.email)}&autostart=true`;
    
    return NextResponse.json({ id: data.id, url: customizedEmbedUrl });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}