import { NextResponse } from "next/server";

export async function GET() {
  const hospitals = [
    { name: "Medanta – The Medicity", distance: "2.1 km", wait: "15 min", rating: 4.8, phone: "0124-4141414", type: ["Cardiology", "Oncology", "Emergency"] },
    { name: "Fortis Memorial Research Institute", distance: "3.4 km", wait: "25 min", rating: 4.7, phone: "0124-4921021", type: ["Neurology", "Orthopaedics"] },
    { name: "Max Super Speciality Hospital", distance: "4.8 km", wait: "30 min", rating: 4.6, phone: "0124-4192000", type: ["Emergency", "Paediatrics"] },
    { name: "Paras Hospitals", distance: "5.2 km", wait: "20 min", rating: 4.5, phone: "0124-4585555", type: ["Dermatology", "ENT"] },
  ];
  return NextResponse.json({ hospitals });
}
