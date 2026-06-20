/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{svelte,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#faf9f7',
        foreground: '#1a1a1a',
        accent: '#4f9e8a',
        'accent-light': '#7ab9a8',
        'text-secondary': '#666666',
      },
      fontFamily: {
        sans: ['Lora', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'title-xl': ['2.5rem', { lineHeight: '1.2' }],
        'title-lg': ['2rem', { lineHeight: '1.3' }],
        'title-md': ['1.5rem', { lineHeight: '1.3' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body-md': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
}
