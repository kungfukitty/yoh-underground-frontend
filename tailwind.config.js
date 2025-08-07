/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // Look in all JS, JSX, TS, and TSX files in the src folder
    ],
    theme: {
        extend: {
            colors: {
                'accent-gold': '#c0a062',
            }
        },
    },
    plugins: [],
}
