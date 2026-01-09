import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Rosti brand colors
        rosti: {
          cream: '#f8f6f3',
          'cream-dark': '#f0ede8',
          gold: '#d4a574',
          'gold-dark': '#c19660',
          'gold-light': '#e8c999',
          brown: '#046c4e',
          'brown-dark': '#047857',
          'fiber-green': '#004a2c',
          'disease-red': '#780204',
        },
        // Additional brand colors
        brand: {
          'fiber-green': '#004a2c',
          'gold-accent': '#d4a574',
          'cream-bg': '#f8f6f3',
        },
        // Ingredient colors
        ingredient: {
          beetroot: '#c8102e', // Deep red for beetroot/cékla
          carrot: '#ff8c42',   // Orange for carrot/sárgarépa
          cucumber: '#7cb342', // Green for cucumber/uborka
          berry: '#8e44ad',    // Purple for berries/bogyók
          citrus: '#f39c12',   // Yellow-orange for citrus
          apple: '#e74c3c',    // Red for apple/alma
          mint: '#2ecc71',     // Fresh green for mint/zellergumó
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
