/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        safeaid: {
          navy: "#080d1a",
          card: "#0f172a",
          elevated: "#18243c",
          border: "#1e293b",
          cyan: "#06b6d4",
          teal: "#14b8a6",
          emergency: "#ef4444",
          critical: "#dc2626",
          warning: "#f59e0b",
          success: "#10b981"
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'alert-glow': 'alertGlow 1.8s ease-in-out infinite'
      },
      keyframes: {
        alertGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(239, 68, 68, 0.8)' }
        }
      }
    }
  },
  plugins: []
};
