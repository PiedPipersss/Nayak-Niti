import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-orange': '#FF9800',
        'primary-orange-light': '#FFB74D',
        'secondary-teal': '#00BCD4',
        'secondary-teal-dark': '#0097A7',
        'bg-light': '#FAFAFA',
        'bg-lighter': '#ECEFF1',
        'text-dark': '#263238',
        'text-gray': '#424242',
        'success-green': '#4CAF50',
        'error-red': '#EF5350',
      },
    },
  },
  plugins: [],
};
export default config;