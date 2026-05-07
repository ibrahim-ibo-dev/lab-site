import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0A0A0F",
        secondary: "#12121A",
        surface: {
          DEFAULT: "#12121A",
          raised: "#1A1A24",
          overlay: "#22222E",
        },
        accent: {
          DEFAULT: "#D4A574",
          light: "#E8C9A0",
          soft: "rgba(212, 165, 116, 0.12)",
          muted: "rgba(212, 165, 116, 0.06)",
        },
        "accent-light": "#E8C9A0",
        muted: "#8A8A9A",
        subtle: "#5A5A6A",
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.06)",
          accent: "rgba(212, 165, 116, 0.15)",
          hover: "rgba(212, 165, 116, 0.25)",
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "overline": ["0.6875rem", { lineHeight: "1.3", letterSpacing: "0.15em", fontWeight: "500" }],
      },
      boxShadow: {
        "glow-sm": "0 0 20px rgba(212, 165, 116, 0.08)",
        "glow-md": "0 0 40px rgba(212, 165, 116, 0.12)",
        "card": "0 4px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(212,165,116,0.04)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(212,165,116,0.12), 0 0 30px rgba(212,165,116,0.06)",
      },
      transitionDuration: { "400": "400ms", "600": "600ms" },
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },
  },
  plugins: [],
};

export default config;
