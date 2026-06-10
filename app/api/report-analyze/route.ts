import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ summary: "No file received." }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type as string;
    const isImage = mimeType.startsWith("image/");

    const contentBlock = isImage
      ? {
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: mimeType as "image/jpeg" | "image/png",
            data: base64,
          },
        }
      : {
          type: "document" as const,
          source: {
            type: "base64" as const,
            media_type: "application/pdf" as const,
            data: base64,
          },
        };

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            contentBlock,
            {
              type: "text",
              text: `You are a medical report analyzer. Analyze this report and return ONLY a JSON object, no markdown, no extra text:
{
  "summary": "2-3 sentence overall summary",
  "keyFindings": ["finding 1", "finding 2", "finding 3"],
  "redFlags": ["concern 1"],
  "medications": ["med 1"],
  "recommendations": ["rec 1", "rec 2"]
}
If a field has nothing, return an empty array [].`,
            },
          ],
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({ structured: parsed });
  } catch (err) {
    console.error("Report analyze error:", err);
    return NextResponse.json(
      { summary: "Error analyzing report. Please try again." },
      { status: 500 }
    );
  }
}