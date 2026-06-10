import { NextResponse } from "next/server";

export async function POST() {
  try {
    const apiKey = process.env.TRUGEN_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing TRUGEN_API_KEY environment variable." }, { status: 500 });
    }

    const res = await fetch("https://api.trugen.ai/v1/ext/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        agent_name: "MedLive Healthcare Assistant",
        agent_system_prompt: "You are MedLive, a compassionate healthcare AI assistant. Help users understand symptoms, medications, and health concerns. Always recommend consulting a licensed doctor. For emergencies say call 112 immediately.",
        config: {
          timeout: 240,
        },
        avatars: [
          {
            avatar_key_id: "665a1170",
            config: {
              llm: { model: "meta-llama/llama-4-maverick-17b-128e-instruct", provider: "groq" },
              stt: { model: "flux-general-en", provider: "deepgram", min_endpointing_delay: 0.3, max_endpointing_delay: 0.4 },
              tts: { model_id: "eleven_turbo_v2_5", provider: "elevenlabs", voice_id: "ZUrEGyu8GFMwnHbvLhv2" },
            },
            welcome_message: {
              wait_time: 2,
              messages: ["Hi! I'm Dr. MedLive. How can I help you today?"],
            },
          },
        ],
        record: true,
      }),
    });

    const rawText = await res.text();
    console.log("TruGen status:", res.status);
    console.log("TruGen response:", rawText);

    if (!res.ok) {
      return NextResponse.json({ error: "TruGen failed", detail: rawText }, { status: 500 });
    }

    const data = JSON.parse(rawText);
    const embedUrl = `https://app.trugen.ai/embed/${data.id}`;
    return NextResponse.json({ id: data.id, url: embedUrl });

  } catch (err) {
    console.error("Agent route error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}