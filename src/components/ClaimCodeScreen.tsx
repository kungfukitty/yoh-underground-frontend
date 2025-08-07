// File: src/components/ClaimCodeScreen.tsx - CORRECTED (Syntax Fix)

import React, { useState } from 'react'; // CORRECTED: Added 'from 'react''


interface ClaimCodeScreenProps {
    onClaimSuccess: () => void;
    onNavigateToLogin: () => void;
}

const ClaimCodeScreen: React.FC<ClaimCodeScreenProps> = ({ onClaimSuccess, onNavigateToLogin }) => {
    const [accessCode, setAccessCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setError(null);
        setIsLoading(true);

        try {
            // --- FIX START: Corrected endpoint URL ---
            const response = await fetch('https://yoh-underground-server.vercel.app/api/auth/claim-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessCode, password }),
            });
            // --- FIX END ---

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await response.json();
                    setError(errorData.message || 'An unexpected error occurred during claim.');
                } else {
                    const errorText = await response.text();
                    setError(`Error: ${response.status} ${response.statusText} - ${errorText.substring(0, 100)}...`);
                }
                setSuccessMessage(null);
            } else {
                const data = await response.json();
                setSuccessMessage(data.message || 'Account activated successfully!');
                setError(null);
                onClaimSuccess(); // Navigate to login after successful claim
            }
        } catch (err: any) {
            setError(err.message || 'Network error or unable to connect.');
            setSuccessMessage(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
                <div className="bg-[#0A0A0A] p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <img src="https://assets.website-files.com/65706596b539070949a0a09e/65706596b539070949a0a0d4_Logo.svg" alt="Yoh Underground Logo" className="mx-auto mb-8 w-24" />
                    <h2 className="text-3xl font-bold mb-6">Activate Your Account</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Access Code"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            required
                            className="w-full bg-[#1A1A1A] text-white border border-gray-700 rounded-md p-3 transition"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-[#1A1A1A] text-white border border-gray-700 rounded-md p-3 transition"
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-[#1A1A1A] text-white border border-gray-700 rounded-md p-3 transition"
                        />

                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

                        <div className="pt-2">
                            <button type="submit" disabled={isLoading} className="w-full btn-primary py-3 px-12 rounded-md text-lg">
                                {isLoading ? 'Activating...' : 'Activate'}
                            </button>
                        </div>
                    </form>
                    <p className="mt-8 text-sm text-gray-500">
                        Already activated?{' '}
                        <button onClick={onNavigateToLogin} className="accent-gold hover:underline">
                            Proceed to Login
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
}; // Corrected closing brace for the functional component

export default ClaimCodeScreen;