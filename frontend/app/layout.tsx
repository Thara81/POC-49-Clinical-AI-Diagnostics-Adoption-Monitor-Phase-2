import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Infocreon Internship - Clinical AI Diagnostics Adoption Monitoring Dashboard",
  description:
    "Deployment, concordance and time-to-report telemetry for AI-assisted radiology, pathology and triage across Gulf health systems.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-obsidian text-white antialiased overflow-hidden">{children}</body>
    </html>
  );
}