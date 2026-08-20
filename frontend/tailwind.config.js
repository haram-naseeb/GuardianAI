/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        // Priority scale (Section 21). Never rely on colour alone — always
        // pair with an icon + text label.
        critical: { DEFAULT: "hsl(var(--critical))", foreground: "hsl(var(--critical-foreground))", soft: "hsl(var(--critical-soft))" },
        high: { DEFAULT: "hsl(var(--high))", foreground: "hsl(var(--high-foreground))", soft: "hsl(var(--high-soft))" },
        moderate: { DEFAULT: "hsl(var(--moderate))", foreground: "hsl(var(--moderate-foreground))", soft: "hsl(var(--moderate-soft))" },
        low: { DEFAULT: "hsl(var(--low))", foreground: "hsl(var(--low-foreground))", soft: "hsl(var(--low-soft))" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,16,20,0.04), 0 8px 24px -12px rgba(16,16,20,0.12)",
        "soft-lg": "0 2px 8px rgba(16,16,20,0.05), 0 24px 48px -20px rgba(16,16,20,0.22)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 hsl(var(--critical) / 0.5)" },
          "70%": { boxShadow: "0 0 0 12px hsl(var(--critical) / 0)" },
          "100%": { boxShadow: "0 0 0 0 hsl(var(--critical) / 0)" },
        },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: {
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite",
        shimmer: "shimmer 1.6s infinite",
        "fade-in": "fade-in 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
