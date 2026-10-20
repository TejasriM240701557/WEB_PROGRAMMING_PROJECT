/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme surfaces
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F4F5F7',
          tertiary: '#F9FAFB',
          elevated: '#FAFAFA',
        },
        border: {
          DEFAULT: '#E5E7EB',
          subtle: '#F0F1F3',
          strong: '#D1D5DB',
        },
        // Text hierarchy
        ink: {
          DEFAULT: '#111827',
          secondary: '#374151',
          muted: '#6B7280',
          faint: '#9CA3AF',
          placeholder: '#D1D5DB',
        },
        // Finora brand
        finora: {
          primary: '#4F46E5',
          'primary-light': '#EEF2FF',
          secondary: '#06B6D4',
          'secondary-light': '#ECFEFF',
          accent: '#10B981',
          'accent-light': '#ECFDF5',
        },
        // Status colors
        positive: {
          DEFAULT: '#10B981',
          light: '#ECFDF5',
          border: '#A7F3D0',
        },
        negative: {
          DEFAULT: '#EF4444',
          light: '#FEF2F2',
          border: '#FECACA',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FFFBEB',
          border: '#FDE68A',
        },
        // Chart colors
        chart: {
          blue: '#3B82F6',
          indigo: '#6366F1',
          cyan: '#06B6D4',
          green: '#10B981',
          pink: '#EC4899',
          amber: '#F59E0B',
          purple: '#8B5CF6',
          rose: '#F43F5E',
        },
        // Keep neon for dark mode compat
        neon: {
          violet: '#A855F7',
          cyan: '#22D3EE',
          mint: '#5CFFB2',
          pink: '#FF4FD8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'card-md': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'card-lg': '0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)',
        'dropdown': '0 10px 30px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)',
        'nav': '0 1px 0 #E5E7EB',
        'inset-top': 'inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        // Dark mode compat
        'glow-violet': '0 0 24px -4px rgba(168, 85, 247, 0.35)',
        'glow-cyan': '0 0 24px -4px rgba(34, 211, 238, 0.35)',
        'glow-mint': '0 0 24px -4px rgba(92, 255, 178, 0.35)',
        'glow-pink': '0 0 24px -4px rgba(255, 79, 216, 0.35)',
        'card-depth': '0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.06)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.3s ease-out forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.85)' },
        },
      },
    },
  },
  plugins: [],
}
