/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        // This line tells Tailwind to scan all your component files for class names.
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            // Here we define the custom "Midnight Blue" color palette.
            // These names can be used throughout your app (e.g., `bg-background`, `text-text-primary`).
            colors: {
                // Background Colors
                'background': '#0D1117',      // Very dark navy blue (replaces pure black)
                'card-bg': '#161B22',         // Slightly lighter navy for cards and containers
                'foreground': '#21262D',      // A slightly lighter shade for hover states or secondary elements

                // Text Colors
                'text-primary': '#C9D1D9',      // Off-white for main text (high contrast)
                'text-secondary': '#8B949E',    // Lighter gray for secondary text, labels, and descriptions

                // Accent Colors
                'accent-gold': '#D4AF37',      // The original gold for high-priority items and titles
            },
        },
    },
    plugins: [],
};
