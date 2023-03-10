/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  content: [
    './node_modules/flowbite-react/**/*.js',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
    './public/**/*.html',
  ],
  enabled: process.env.NODE_ENV === 'production',
  plugins: [require('flowbite/plugin')],
  options: {
    safelist: [],
  },
  darkMode: `class`,
};
