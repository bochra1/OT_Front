/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Tunisie Telecom Brand Colors
        "tt-primary": {
          50: "#FFF4EB",
          100: "#FFE8D7",
          200: "#FFD1AF",
          300: "#FFBA87",
          400: "#FF9E5F",
          500: "#FF6B00", // Main Orange
          600: "#E55A00",
          700: "#CC4900",
          800: "#B23800",
          900: "#992700",
        },
        "tt-secondary": {
          50: "#F0F4FB",
          100: "#E1E8F7",
          200: "#C3D1EF",
          300: "#A5BAE7",
          400: "#8703DF",
          500: "#003D7A", // Deep Blue
          600: "#00326A",
          700: "#00275A",
          800: "#001F4A",
          900: "#00173A",
        },
        "tt-accent": {
          50: "#F5F5F5",
          100: "#E8E8E8",
          200: "#D1D1D1",
          300: "#B9B9B9",
          400: "#A1A1A1",
          500: "#808080", // Gray
          600: "#666666",
          700: "#4D4D4D",
          800: "#333333",
          900: "#1A1A1A",
        },
      },
      backgroundImage: {
        "tt-gradient": "linear-gradient(135deg, #FF6B00 0%, #003D7A 100%)",
        "tt-gradient-reverse":
          "linear-gradient(135deg, #003D7A 0%, #FF6B00 100%)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        neosans: ["NeoSansStd-Bold", "sans-serif"],
      },
      boxShadow: {
        "tt-lg": "0 20px 25px -5px rgba(255, 107, 0, 0.1)",
        "tt-md": "0 10px 15px -3px rgba(0, 61, 122, 0.1)",
      },
    },
  },
  daisyui: {
    themes: [
      {
        tt_blue: {
          primary: "#FF6B00",
          "primary-content": "#ffffff",
          secondary: "#003D7A",
          "secondary-content": "#ffffff",
          accent: "#E1E8F7",
          "accent-content": "#003D7A",
          neutral: "#2a2e37",
          "neutral-content": "#d7dadc",
          "base-100": "#ffffff",
          "base-200": "#f5f5f5",
          "base-300": "#e8e8e8",
          "base-content": "#2a2e37",
          info: "#0ea5e9",
          "info-content": "#000000",
          success: "#10b981",
          "success-content": "#000000",
          warning: "#f59e0b",
          "warning-content": "#000000",
          error: "#ef4444",
          "error-content": "#ffffff",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
