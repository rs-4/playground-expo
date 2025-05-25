/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./global.css"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontSize: {
        // Tailles sémantiques avec valeurs directes
        h1: '36px',
        h2: '24px',
        h3: '20px',
        h4: '16px',
        h5: '14px',
        h6: '12px',
        // Tailles numériques personnalisées
        '14': '14px',
        '36': '36px',
        '24': '24px',
        '26': '26px',
      },
    },
  },
  plugins: [],
}