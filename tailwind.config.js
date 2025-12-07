/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            colors: {
                bg: '#0A0A0A',
                surface: {
                    100: '#171717',
                    200: '#262626',
                    300: '#D4D4D4', // Much lighter grey (Neutral 300) for maximum contrast
                },
                border: '#262626',
                accent: '#6366f1', // Indigo 500
                data: {
                    spam: '#ef4444',
                    ham: '#22c55e',
                }
            },
            backgroundImage: {
                'grid-pattern': "radial-gradient(#262626 1px, transparent 1px)",
            }
        },
    },
    plugins: [],
}
