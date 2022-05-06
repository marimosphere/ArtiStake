module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "marimo-1": "#4E944F", // 34A0A4
        "marimo-2": "#76C893", // background 2
        "marimo-3": "#52B69A", // bg 3
        "marimo-4": "#99D98C", // 帯の色
        "marimo-5": "#D9ED92", // ボタン
        "marimo-6": "#4B5563", // 黒色
      },
      fontSize: {
        "2xs": "0.5em",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
