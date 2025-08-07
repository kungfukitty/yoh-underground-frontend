import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: './',             // ← all asset URLs will be relative
    build: {
        outDir: 'dist',       // ← your production bundle lands here
        emptyOutDir: true
    }
});

