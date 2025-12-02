import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)"],
            },
            colors: {
                background: "#0f172a",
                foreground: "#f8fafc",
                primary: "#6366f1",
                secondary: "#ec4899",
                accent: "#06b6d4",
            },
        },
    },
    plugins: [],
};
export default config;
