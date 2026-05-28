import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedLive — Real-Time Healthcare AI Agent",
  description: "A real-time video AI healthcare assistant powered by TruGen AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
