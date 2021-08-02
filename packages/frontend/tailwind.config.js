module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "marimo-1": "#1C203C",
        "marimo-2": "#17207F",
        "marimo-3": "#234F90",
        "marimo-4": "#408D9D",
        "marimo-5": "#60A5FA",
        "marimo-6": "#4B5563",
      },
    },
    fontSize: {
      "2xs": "0.5em",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
