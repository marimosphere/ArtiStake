module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // dark color
        // "marimo-1": "#4E944F", // bg1
        // "marimo-2": "#76C893", // bg2
        // "marimo-3": "#52B69A", // bg3
        // "marimo-4": "#99D98C", // 帯の色
        // "marimo-5": "#D9ED92", // ボタン
        // "marimo-6": "#4B5563", // 黒色
        //
        // light color
        "marimo-1": "#D8F3DC", // bg1        
        "marimo-2": "#E6F5EB", // bg2
        "marimo-3": "#8ED4A7", // bg3
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
