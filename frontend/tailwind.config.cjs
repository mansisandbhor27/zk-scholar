module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#060617',
        'accent-start': '#6b21a8',
        'accent-end': '#0ea5e9',
        'cyan-glow': '#06b6d4',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: [],
}
