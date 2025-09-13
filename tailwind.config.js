export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          400: "#267BA2",
          500: "#006492",
          600: "#005880",
          700: "#004E71",
          800: "#004463",
          DEFAULT: "#006492",
        },
        // 💖 brand pink (used for CTAs, rings, accents)
        pink: {
          400: "#E65BAE",
          500: "#D23393", // primary brand pink
          600: "#B61F79",
          700: "#8A114E", // deeper pink used in some text
          DEFAULT: "#D23393",
        },
        // utility surfaces you were using as hex
        sand: "#E7EEF6", // avatar placeholder bg
        foam: "#E6F2FA", // cover area fallback
        ink: "#111111",
      },
    },
  },
  plugins: [],
};
