/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "",
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: ["./src/**/*.{html,ts}"],
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        fhd: "1900px",
        qhd: "2500px",
      },
      maxWidth: {
        100: "100px",
        155: "155px",
        200: "200px",
        300: "300px",
        400: "400px",
        500: "500px",
      },
      width: {
        100: "100px",
        140: "140px",
        200: "200px",
        300: "300px",
        400: "400px",
        500: "500px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
