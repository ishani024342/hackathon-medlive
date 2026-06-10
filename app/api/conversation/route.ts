import { NextRequest, NextResponse } from "next/server";

const responses: Record<string, string> = {
  chest: "Chest pain can have many causes — from muscle strain to cardiac issues. Is it sharp or pressure-like? Does it radiate to your arm or jaw? If severe or you feel dizzy, call 112 immediately. Please consult a licensed healthcare professional.",
  heart: "Heart-related symptoms like palpitations, chest tightness, or shortness of breath should be evaluated promptly. Avoid caffeine, rest, and monitor your pulse. Please consult a licensed healthcare professional.",
  fatigue: "Fatigue can be caused by anaemia, thyroid issues, poor sleep, or infections. A blood test (CBC + thyroid panel) can help identify the cause. Please consult a licensed healthcare professional.",
  fever: "For fever above 38.5°C lasting more than 2 days, or with stiff neck, rash, or breathing difficulty — seek immediate care. Stay hydrated and rest. Please consult a licensed healthcare professional.",
  headache: "Headaches can be tension, migraine, or sinus-related. Is it throbbing, one-sided, or all over? A sudden severe headache needs emergency care immediately. Please consult a licensed healthcare professional.",
  cough: "How long have you had the cough? Is it dry or producing mucus? Any fever or shortness of breath? A cough lasting more than 3 weeks should be evaluated by a doctor. Please consult a licensed healthcare professional.",
  cold: "For cold symptoms: rest, stay hydrated, and use saline nasal drops. If symptoms worsen after 7 days or fever develops, see a doctor. Please consult a licensed healthcare professional.",
  diabetes: "For diabetes: monitor blood sugar regularly, take medications as prescribed, follow a low-glycaemic diet, and exercise moderately. HbA1c should be checked every 3 months. Please consult a licensed healthcare professional.",
  blood: "Seeing blood in urine, stool, or vomit requires prompt medical attention. Please visit a hospital or call your doctor today. Please consult a licensed healthcare professional.",
  pressure: "Normal BP is below 120/80 mmHg. Readings above 140/90 consistently indicate hypertension. Reduce salt, exercise regularly, and avoid smoking. Please consult a licensed healthcare professional.",
  anxiety: "Anxiety symptoms like racing heart and breathlessness can be managed with deep breathing and regular sleep. If affecting daily life, a doctor or therapist can help. Please consult a licensed healthcare professional.",
  depression: "Feeling persistently low or losing interest in activities are signs worth discussing with a mental health professional. You are not alone — help is available. Please consult a licensed healthcare professional.",
  medication: "Please share the medication name and I can explain its general purpose and common side effects. Never stop or change doses without consulting your doctor first.",
  hospital: "You can find nearby hospitals in the Hospitals tab on the right panel. For emergencies, tap the red 112 button immediately.",
  emergency: "If this is a medical emergency — chest pain, difficulty breathing, loss of consciousness, or stroke symptoms — call 112 immediately. Do not wait.",
  vomit: "Stay hydrated with small sips of water. If vomiting persists more than 24 hours or contains blood, seek medical attention. Please consult a licensed healthcare professional.",
  stomach: "Stomach pain location matters — upper, lower, left, or right? Is it cramping or constant? Any fever, nausea, or changes in bowel habits? Please consult a licensed healthcare professional.",
  back: "Back pain is very common and usually muscular. Rest, gentle stretching, and over-the-counter pain relief can help. If pain radiates down your leg or causes numbness, see a doctor. Please consult a licensed healthcare professional.",
  sleep: "Poor sleep affects overall health. Maintain a consistent sleep schedule, avoid screens 1 hour before bed, and limit caffeine after 2pm. Please consult a licensed healthcare professional.",
  weight: "Unexplained weight loss or gain can indicate thyroid issues, diabetes, or other conditions. A blood panel is a good starting point. Please consult a licensed healthcare professional.",
  skin: "Skin issues like rashes or unusual spots should be evaluated by a dermatologist, especially if they change in size or colour. Please consult a licensed healthcare professional.",
  hello: "Hello! I'm here to help with your health questions. Please describe your symptoms and I'll guide you. Remember I'm an AI assistant — always consult a real doctor for medical decisions.",
  hi: "Hi there! Tell me what's bothering you today and I'll do my best to help guide you. Please consult a licensed healthcare professional for medical decisions.",
  help: "I can help you with symptoms, medications, lab results, and finding nearby hospitals. Just describe what you're experiencing.",
};

const DEFAULT = "Thank you for sharing that. Could you describe your symptoms in more detail — when did they start, how severe are they (1–10), and do you have any existing medical conditions? Please consult a licensed healthcare professional for medical decisions.";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const last = messages[messages.length - 1]?.content?.toLowerCase() || "";
    const matched = Object.entries(responses).find(([keyword]) => last.includes(keyword));
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ reply: matched ? matched[1] : DEFAULT });
  } catch {
    return NextResponse.json({ reply: "Sorry, something went wrong. Please try again." }, { status: 500 });
  }
}
