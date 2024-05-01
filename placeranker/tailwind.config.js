/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        eggshell: "#F6EFE4",
      },
      fontFamily: {
        inter: ["Inter, sans-serif", { fontFeatureSettings: '"sups", "ss01"' }],
      },
    },
  },
  plugins: [],
};
