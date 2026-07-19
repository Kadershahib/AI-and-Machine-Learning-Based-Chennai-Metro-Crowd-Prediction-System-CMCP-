/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base — deep transit control-room navy
        base: {
          950: "#070B14",
          900: "#0A0F1C",
          800: "#111A2E",
          700: "#16213A",
          600: "#1D2C4A",
          500: "#2A3B5C",
        },
        // Chennai Metro real line colors, tuned for screen
        metro: {
          blue: "#2E6FE0",
          "blue-dim": "#1D4C9E",
          green: "#22B573",
          "green-dim": "#17805199",
        },
        // Crowd-level semantic scale
        crowd: {
          low: "#22C55E",
          medium: "#F5A623",
          high: "#EF4444",
        },
        ink: {
          primary: "#F2F5FA",
          secondary: "#B8C2D9",
          muted: "#7C8AA5",
          faint: "#4C5872",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -8px rgba(0,0,0,0.5)",
        glow: "0 0 24px -4px var(--tw-shadow-color)",
      },
      animation: {
        "pulse-slow": "pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-fast": "pulse 1.1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
