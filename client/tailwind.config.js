/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#06162B',
          900: '#0A2342', // Primary Navy Blue
          800: '#102E54',
          700: '#163A63', // Secondary Blue
          600: '#1F4E85',
          500: '#2A64A7',
          100: '#E6EFF9',
          50: '#F0F5FA',
        },
        americanRed: {
          900: '#8A1721',
          800: '#A71D2A',
          DEFAULT: '#C62835', // American Red
          hover: '#B2202C',
          light: '#FDE8EA',
          50: '#FFF5F5',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#F5F7FA', // Light Background
          muted: '#F8FAFC',
          card: '#FFFFFF',
        },
        darkText: '#172B45', // Dark Text
        mutedText: '#64748B', // Muted Text
        appBorder: '#E2E8F0', // Border
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(10, 35, 66, 0.06)',
        'premium': '0 20px 40px -15px rgba(10, 35, 66, 0.12)',
        'card': '0 2px 12px rgba(10, 35, 66, 0.04), 0 1px 3px rgba(10, 35, 66, 0.06)',
        'card-hover': '0 20px 30px -10px rgba(10, 35, 66, 0.15), 0 8px 10px -6px rgba(10, 35, 66, 0.05)',
        'cta': '0 8px 24px -4px rgba(198, 40, 53, 0.35)',
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #0A2342 0%, #163A63 100%)',
        'navy-radial': 'radial-gradient(circle at top right, #163A63 0%, #0A2342 100%)',
        'subtle-gray': 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

