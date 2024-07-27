// const { nextui } = require("@nextui-org/react");
import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        scmin: { max: "1160px" },
        scmed: { max: "845px" },
        // scmobile: { max: "430px" },
        scmobile: { max: "555px" },
      },
      fontSize: {
        mobilexs: "10px",
        mobilesm: "12px",
        mobilemd: "14px",
        mobilelg: "16px",
        mobilexl: "18px",
      },
    },
  },
  plugins: [],
  darkMode: "class",
  plugins: [nextui()],
};
