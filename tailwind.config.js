/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        minecraft: ['Minecraft AE', 'monospace'],
      },
      colors: {
        mc: {
          green: '#4CAF50',
          'green-dark': '#388E3C',
          'green-light': '#81C784',
          dirt: '#8B6914',
          stone: '#7F7F7F',
          grass: '#5B8731',
          sky: '#87CEEB',
          bg: '#F0F4F0',
          card: '#FFFFFF',
          border: '#E0E8E0',
        },
        spigot: {
          DEFAULT: '#EE8A18',
          dark: '#C97210',
        },
        hangar: {
          DEFAULT: '#1E88E5',
          dark: '#1565C0',
        },
        modrinth: {
          DEFAULT: '#1BD96A',
          dark: '#15B857',
        },
        // Dark mode specific
        dark: {
          bg: '#1a1a2e',
          card: '#16213e',
          'card-hover': '#1a2744',
          border: '#2a3a5c',
          text: '#e0e0e0',
          'text-secondary': '#a0a0b0',
          surface: '#0f3460',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
