// const { nextui } = require("@heroui/react");
import {heroui} from "@heroui/react";


/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        scminX: { min: "1281px" },
        scmin: { max: "1280px" },
        sc4row: { max: "1230px" },
        sc3row: { max: "1045px" },
        sc2row: { max: "870px" },
        scmed: { max: "845px" },
        // scmobile: { max: "430px" },
        scmobile: { max: "555px" },
        scmobileX: { min: "555px" },
        // (min-width: 550px)
        // (min-width: 950px)
        // (min-width: 1128px)
        // (min-width: 1640px)
        // (min-width: 1880px)
        hideNavBar: { max: "700px" },
        hideSideBar: { max: "659px" },
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
  plugins: [heroui()],
};
