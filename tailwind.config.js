export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          400: "#267BA2", // focus ring / subtle accents
          500: "#006492", // your exact button color
          600: "#005880", // hover
          700: "#004E71", // active
          800: "#004463",
          DEFAULT: "#006492",
        },
        ink: "#111111",
      },
    },
  },
  plugins: [],
};
