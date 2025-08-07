import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App'; // Corrected: Removed the .tsx extension

// Find the root element and render the App component
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);