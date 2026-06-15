/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#0B3D2E',
          50: '#E7F0EC',
          100: '#C5DBD1',
          600: '#0F5440',
          700: '#0B3D2E',
          900: '#062418',
        },
        gold: {
          DEFAULT: '#C8860A',
          light: '#E0A832',
          dark: '#9C6804',
        },
        cream: {
          DEFAULT: '#FAF7F0',
          dark: '#F1EBDD',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};
