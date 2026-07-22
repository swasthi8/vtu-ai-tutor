/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#7C3AED',
        accent: '#06B6D4',
        success: '#22C55E',
        warning: '#F59E0B'
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      borderRadius: {
        'xl-2': '1rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
}
