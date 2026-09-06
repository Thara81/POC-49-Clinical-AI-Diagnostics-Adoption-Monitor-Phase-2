import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Clinical AI Visual DNA — deep midnight teal-charcoal (luminance < 10%)
        obsidian: "#071A20",      // base canvas
        surface: "#0D242B",       // panel surface
        slateBorder: "#17323B",   // hairline borders
        brandTeal: "#2DD4BF",     // primary chrome / glow accent
        // Functional use-case legend colors (unchanged — meaningful, not decorative)
        cyan: "#38BDF8",          // radiology
        amber: "#F59E0B",         // pathology
        indigo: "#818CF8",        // triage
      },
      fontFamily: {
        sans: ["Inter", "Geist Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "teal-glow": "0 0 0 0.5px rgba(45, 212, 191, 0.9), 0 0 14px rgba(45, 212, 191, 0.25)",
        "cyan-glow": "0 0 0 0.5px rgba(56, 189, 248, 0.9), 0 0 12px rgba(56, 189, 248, 0.25)",
      },
      letterSpacing: {
        tightest: "-0.02em",
      },
    },
  },
  plugins: [],
};
export default config;