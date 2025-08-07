// File: src/components/AuthScreen.tsx
import React, { useState, useEffect } from 'react';

// REMOVED: Firebase Client SDK imports for getAuth, signInWithEmailAndPassword
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; 

interface AuthScreenProps {
    onLoginSuccess: (user: any, token: string) => void;
    onNavigateToClaim: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, onNavigateToClaim }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // --- CRUCIAL FIX START: Send email and password directly ---
            const response = await fetch('https://yoh-underground-server.vercel.app/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }), // Sending email and password directly
            });
            // --- CRUCIAL FIX END ---

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await response.json();
                    setError(errorData.message || 'Login failed. Please check your credentials.');
                } else {
                    const errorText = await response.text();
                    console.error("Server returned non-JSON response:", errorText);
                    setError(`Error: ${response.status} ${response.statusText} - ${errorText.substring(0, 100)}...`);
                }
            } else {
                const data = await response.json();
                // Assuming your backend sends back 'token' and a 'user' object with id, email, name, isAdmin
                onLoginSuccess(
                    {
                        id: data.user.id,
                        email: data.user.email,
                        name: data.user.name || data.user.email,
                        isAdmin: data.user.isAdmin || false,
                    },
                    data.token
                );
            }
        } catch (err: any) {
            // Simplified error handling since Firebase client errors are no longer expected here
            setError(err.message || 'Network error or unable to connect to the server.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Rest of your AuthScreen component (useEffect and styling) remains unchanged ---
    useEffect(() => {
        const yearEl = document.getElementById('year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear().toString();
        }
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.querySelectorAll('#mobile-menu a, .nav-link');
        const handleMenuToggle = () => mobileMenu?.classList.toggle('hidden');
        const closeMenu = () => mobileMenu?.classList.add('hidden');
        mobileMenuButton?.addEventListener('click', handleMenuToggle);
        navLinks.forEach(link => link.addEventListener('click', closeMenu));
        const animatedSections = document.querySelectorAll('.fade-in-up');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedSections.forEach(section => observer.observe(section));
        const header = document.getElementById('header');
        const handleScroll = () => {
            if (window.scrollY > 10) {
                header?.classList.add('shadow-lg');
            } else {
                header?.classList.remove('shadow-lg');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            mobileMenuButton?.removeEventListener('click', handleMenuToggle);
            navLinks.forEach(link => link.removeEventListener('click', closeMenu));
            window.removeEventListener('scroll', handleScroll);
            animatedSections.forEach(section => observer.unobserve(section));
        };
    }, []);

    const styles = `
        :root {
            --background: #111111;
            --foreground: #1A1A1A;
            --text-primary: #EAEAEA;
            --text-secondary: #A0A0A0;
            --accent: #B8860B;
        }
        html {
            scroll-behavior: smooth;
        }
        body {
            background-color: var(--background);
            color: var(--text-primary);
            font-family: 'Poppins', sans-serif;
        }
        .font-serif {
            font-family: 'Playfair Display', serif;
        }
        .hero-bg {
            background-color: var(--background);
            background-image: radial-gradient(circle at center, rgba(26, 26, 26, 0.5) 0%, var(--background) 70%);
        }
        .accent-gold {
            color: var(--accent);
        }
        .btn-primary {
            background-color: var(--accent);
            color: var(--background);
            font-weight: 600;
            letter-spacing: 0.05em;
            transition: all 0.3s ease;
            border: 2px solid var(--accent);
        }
        .btn-primary:hover {
            background-color: transparent;
            color: var(--accent);
        }
        .btn-secondary {
            background-color: transparent;
            color: var(--text-secondary);
            border: 2px solid #333333;
            transition: all 0.3s ease;
            font-weight: 600;
        }
        .btn-secondary:hover {
            border-color: var(--accent);
            color: var(--accent);
        }
        .card-bg {
            background-color: var(--foreground);
            border: 1px solid #2a2a2a;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-bg:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.4);
        }
        .fade-in-up {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .fade-in-up.visible {
            opacity: 1;
            transform: translateY(0);
        }
        input:focus, textarea:focus {
            outline: none;
            box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--accent);
        }
    `;

    return (
        <>
            <style>{styles}</style>
            <div className="antialiased">
                {/* Header */}
                <header id="header" className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg transition-shadow duration-300">
                    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                        <a href="#home" className="nav-link" style={{ width: '150px' }}>
                            <svg viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <text x="0" y="30" fontFamily="Poppins, sans-serif" fontSize="32" fontWeight="700" fill="#EAEAEA">YOH</text>
                                <text x="70" y="30" fontFamily="Poppins, sans-serif" fontSize="12" fill="#EAEAEA">underground</text>
                                <rect y="38" width="55" height="2" fill="#B8860B"></rect>
                            </svg>
                        </a>
                        <nav className="hidden md:flex items-center space-x-6">
                            <a href="#ethos" className="text-sm text-gray-300 hover:text-white transition-colors nav-link">The Ethos</a>
                            <a href="#experience" className="text-sm text-gray-300 hover:text-white transition-colors nav-link">The Experience</a>
                            <a href="#gateway" className="btn-secondary py-2 px-6 rounded-md text-sm nav-link">The Protocol</a>
                        </nav>
                        <button id="mobile-menu-button" className="md:hidden text-2xl text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>
                    <div id="mobile-menu" className="hidden md:hidden px-6 pb-4 border-t border-gray-800">
                        <a href="#ethos" className="block py-2 text-gray-300 hover:text-white">The Ethos</a>
                        <a href="#experience" className="block py-2 text-gray-300 hover:text-white">The Experience</a>
                        <a href="#gateway" className="block py-2 text-gray-300 hover:text-white">The Protocol</a>
                    </div>
                </header>

                {/* Hero Section */}
                <section id="home" className="hero-bg min-h-screen flex items-center justify-center text-center pt-20">
                    <div className="max-w-3xl px-6">
                        <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight mb-6">
                            Another Realm Awaits.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                            For a select brotherhood of vetted men, YOH Underground is the key to a South Africa few will ever see. This is not a tour. It is an arrival.
                        </p>
                    </div>
                </section>

                {/* Main Content */}
                <div className="container mx-auto px-6 py-24 space-y-32 md:space-y-48">

                    {/* The Ethos Section */}
                    <section id="ethos" className="max-w-4xl mx-auto text-center fade-in-up">
                        <h2 className="font-serif text-4xl md:text-5xl accent-gold mb-6">The Code.</h2>
                        <p className="text-lg text-gray-400 leading-relaxed">
                            Our foundation is a code of conduct: Absolute Discretion. Unwavering Integrity. Mutual Respect. Every member is vetted. Every interaction is bound by a non-disclosure agreement. This isn't for tourists. This is a curated realm for men who operate at a higher level and expect the same from their experiences--and their company.
                        </p>
                    </section>

                    {/* The Experience Section */}
                    <section id="experience" className="fade-in-up">
                        <div className="text-center">
                            <h2 className="font-serif text-4xl md:text-5xl accent-gold mb-16">Pillars of the Experience</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="card-bg p-8 rounded-lg shadow-2xl">
                                    <div className="h-10 w-10 mx-auto mb-4 accent-gold">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M256 0C181.3 0 121.1 59.5 121.1 133.3c0 28.3 8.6 54.9 24.1 77.2L128 480l128-96 128 96-17.2-169.5c15.5-22.3 24.1-48.9 24.1-77.2C390.9 59.5 330.7 0 256 0zm-64 133.3c0-35.3 28.7-64 64-64s64 28.7 64 64-28.7 64-64 64-64-28.7-64-64z" /></svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-4">Command</h3>
                                    <p className="text-gray-400">Johannesburg's pulse at your fingertips. We provide sovereign access to the city's most coveted nightlife and cultural scenes. You don't wait in line. You are the destination.</p>
                                </div>
                                <div className="card-bg p-8 rounded-lg shadow-2xl">
                                    <div className="h-10 w-10 mx-auto mb-4 accent-gold">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M32 32C14.3 32 0 46.3 0 64v32c0 17.7 14.3 32 32 32h384c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H32zm0 128h44.8l23.2 28.8-32.3 140.3L32 480h384l-35.7-152.9-32.3-140.3L371.2 160H416v32c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32h-1.6C406.8 13.5 393.3 0 377.6 0H70.4C54.7 0 41.2 13.5 33.6 32H32z" /></svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-4">Decompress</h3>
                                    <p className="text-gray-400">Your sanctuary is a private, fully-staffed luxury villa. A private chef, masseuse, and chauffeur operate on your schedule. This is your command center, built for strategic rest and recovery.</p>
                                </div>
                                <div className="card-bg p-8 rounded-lg shadow-2xl">
                                    <div className="h-10 w-10 mx-auto mb-4 accent-gold">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor"><path d="M224 32c-17.7 0-32 14.3-32 32V96c0 12.4-7.2 23.4-18.2 28.4L118.8 152c-11.2 5.1-23.4 6.6-35.3 4.4L32 144c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h50.7l-2.6 14.5C73.4 322.2 96 352 128 352h32c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32c-2.5 0-4.8-1.5-5.8-3.9l-6.1-13.9c-2.4-5.4-1.5-11.7 2.3-16.2L224 128V96l32-32c17.7-14.3 17.7-37.7 0-52s-47-4.3-64 10zM352 256c-17.7 0-32 14.3-32 32v160h-32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32V288c0-17.7-14.3-32-32-32z" /></svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-4">Connect</h3>
                                    <p className="text-gray-400">You are in the company of vetted peers. We facilitate discreet social and professional connections that match your caliber. Every introduction is intentional. Every opportunity is curated.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* The Gateway Section (Login Form) */}
                    <section id="gateway" className="fade-in-up">
                        <div className="text-center">
                            <h2 className="font-serif text-4xl md:text-5xl accent-gold mb-16">The Gateway.</h2>
                            <div className="card-bg rounded-lg p-8 md:p-12 shadow-2xl max-w-lg mx-auto">
                                <h3 className="font-serif text-3xl text-white mb-4">The Sanctum</h3>
                                <p className="text-gray-400 mb-8">Authenticate to proceed.</p>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-md p-3 transition focus:border-accent"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-md p-3 transition focus:border-accent"
                                    />
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                    <div className="pt-4">
                                        <button type="submit" disabled={isLoading} className="w-full md:w-auto btn-primary py-3 px-12 rounded-md text-lg">
                                            {isLoading ? 'Authenticating...' : 'Enter'}
                                        </button>
                                    </div>
                                </form>
                                <p className="mt-8 text-sm text-gray-500">
                                    Need to activate a new account?{' '}
                                    <button onClick={onNavigateToClaim} className="accent-gold hover:underline">
                                        Claim Access Code
                                    </button>
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="border-t border-gray-800/50 mt-24">
                    <div className="container mx-auto px-6 py-6 text-center text-gray-600">
                        <p>&copy; <span id="year"></span> YOH Underground. All Rights Reserved.</p>
                        <p className="text-xs mt-2">Discretion is our currency. Access is your reward.</p>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default AuthScreen;