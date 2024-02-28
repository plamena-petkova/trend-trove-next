import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#ef009b",
          secondary: "#f55f00",
          accent: "#429400",
          neutral: "#280e1e",
          "base-100": "#fcfcfc",
          info: "#3de6ff",
          success: "#00dc70",
          warning: "#c88500",
          error: "#ff317b",
        },
      },
    ],
  },
};
export default config;
