/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground, #FFFFFF)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        // Custom Quantum & Chip Design Tokens
        quantum: {
          DEFAULT: "var(--quantum)",
          foreground: "var(--on-quantum)",
        },
        chip: {
          DEFAULT: "var(--chip)",
          foreground: "var(--on-chip)",
        },
        energy: "var(--energy)",
        wave: "var(--wave)",
        laser: "var(--laser)",
        success: "var(--success)",
        panel: {
          DEFAULT: "var(--panel)",
          raised: "var(--panel-raised)",
        },
        sim: "var(--sim)",
        grid: "var(--grid)",
        locked: "var(--locked)",
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) * 0.8)",
        sm: "calc(var(--radius) * 0.6)",
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", "monospace"],
        heading: ["'Space Grotesk Variable'", "sans-serif"],
        sans: ["'Space Grotesk Variable'", "sans-serif"],
        mono: ["'JetBrains Mono Variable'", "monospace"],
      },
      boxShadow: {
        pixel: "3px 3px 0 0 var(--quantum)",
        "pixel-chip": "3px 3px 0 0 var(--chip)",
        "pixel-muted": "3px 3px 0 0 var(--border)",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.6" },
          "94%": { opacity: "1" },
          "97%": { opacity: "0.8" },
        },
        "float-px": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      animation: {
        flicker: "flicker 4s steps(1) infinite",
        "float-px": "float-px 3s steps(4) infinite",
        blink: "blink 1s steps(1) infinite",
        scan: "scan 7s linear infinite",
      },
    },
  },
  plugins: [],
};
