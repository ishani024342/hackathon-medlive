import { NextResponse } from "next/server";

export async function POST() {
  await new Promise((r) => setTimeout(r, 1500));
  return NextResponse.json({
    id: "demo-agent-" + Date.now(),
    name: "MedLive Healthcare Assistant",
  });
}
