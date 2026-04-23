import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        // Semantic colors for architecture layers
        layer: {
          application: {
            DEFAULT: "#3B82F6", // blue-500
            light: "#DBEAFE",  // blue-100
            dark: "#1E40AF",   // blue-800
          },
          infrastructure: {
            DEFAULT: "#F59E0B", // amber-500
            light: "#FEF3C7",  // amber-100
            dark: "#92400E",   // amber-800
          },
          data: {
            DEFAULT: "#10B981", // emerald-500
            light: "#D1FAE5",  // emerald-100
            dark: "#065F46",   // emerald-800
          },
          security: {
            DEFAULT: "#EF4444", // red-500
            light: "#FEE2E2",  // red-100
            dark: "#991B1B",   // red-800
          },
          integration: {
            DEFAULT: "#8B5CF6", // violet-500
            light: "#EDE9FE",  // violet-100
            dark: "#5B21B6",   // violet-800
          },
        },
        // Severity colors
        severity: {
          error: "#EF4444",
          warning: "#F59E0B",
          info: "#3B82F6",
        },
        // Review status colors
        review: {
          draft: "#6B7280",
          in_review: "#F59E0B",
          approved: "#10B981",
          rejected: "#EF4444",
        },
      },
    },
  },
  plugins: [],
};

export default config;
