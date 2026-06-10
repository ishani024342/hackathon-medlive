import { NextRequest, NextResponse } from "next/server";

const mockAnalysis = [
  "Your report shows all major blood markers within normal range. Haemoglobin is 13.8 g/dL (normal: 12–17), WBC count is 7,200/µL (normal: 4,000–11,000), and platelets are 245,000/µL (normal: 150,000–400,000). No significant abnormalities detected.",
  "Lipid panel results: Total cholesterol 185 mg/dL (normal: <200), LDL 110 mg/dL (borderline), HDL 52 mg/dL (good), Triglycerides 140 mg/dL (normal: <150). Consider dietary changes to lower LDL.",
  "Blood glucose report: Fasting glucose 98 mg/dL (normal: 70–100), HbA1c 5.6% (normal: <5.7%). Values are within normal range with no indication of diabetes at this time.",
  "Thyroid function test: TSH 2.4 mIU/L (normal: 0.4–4.0), T3 1.2 ng/mL (normal: 0.8–2.0), T4 8.5 µg/dL (normal: 5.0–12.0). Thyroid function appears normal.",
  "Liver function test: ALT 28 U/L (normal: 7–56), AST 24 U/L (normal: 10–40), Bilirubin 0.8 mg/dL (normal: 0.2–1.2). Liver enzymes are within normal limits.",
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) return NextResponse.json({ summary: "No file received." }, { status: 400 });
    await new Promise((r) => setTimeout(r, 2000));
    const randomResult = mockAnalysis[Math.floor(Math.random() * mockAnalysis.length)];
    return NextResponse.json({
      summary: randomResult + "\n\n⚠️ This is a demo analysis. In production, your actual report will be analyzed by Claude AI vision.",
    });
  } catch {
    return NextResponse.json({ summary: "Error analyzing report. Please try again." }, { status: 500 });
  }
}
