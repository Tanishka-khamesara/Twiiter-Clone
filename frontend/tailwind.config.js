import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      "light",
      {
        black: {
          primary: "rgb(29, 155, 240)",
          secondary: "rgb(24, 24, 24)",
          accent: "rgb(79, 70, 229)",
          neutral: "rgb(55, 65, 81)",
          "base-100": "rgb(17, 24, 39)",
          info: "rgb(3, 105, 161)",
          success: "rgb(16, 185, 129)",
          warning: "rgb(234, 179, 8)",
          error: "rgb(220, 38, 38)",
        },
      },
    ],
  },
};
