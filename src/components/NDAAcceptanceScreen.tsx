// File: src/components/NDAAcceptanceScreen.tsx

import React, { useState } from 'react';

interface NDAAcceptanceScreenProps {
    onNdaAccepted: () => void;
    userToken: string; // Pass the JWT for API calls
}

const NDAAcceptanceScreen: React.FC<NDAAcceptanceScreenProps> = ({ onNdaAccepted, userToken }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAcceptNda = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('https://yoh-underground-server.vercel.app/api/member/acknowledge-nda', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to acknowledge NDA.');
            }

            // If successful, notify parent component (PortalLayout)
            onNdaAccepted();
        } catch (err: any) {
            setError(err.message || 'Error accepting NDA. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="bg-[#0A0A0A] p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
                <h2 className="text-3xl font-bold mb-6 accent-gold">Non-Disclosure Agreement</h2>
                <p className="text-gray-400 mb-8 text-left max-h-60 overflow-y-auto custom-scrollbar">
                    {/* Placeholder for NDA text - Replace with your actual NDA content */}
                    This Non-Disclosure Agreement ("Agreement") is entered into between YOH Underground and the Member.
                    The Member acknowledges that in the course of their association with YOH Underground, they may be exposed
                    to confidential and proprietary information, including but not limited to, details of events, locations,
                    membership roster, operational procedures, and personal information of other members.
                    <br /><br />
                    The Member agrees to maintain the strictest confidentiality regarding all such information and to use it
                    solely for the purposes of participating in YOH Underground activities. The Member shall not disclose,
                    publish, or disseminate any confidential information to any third party without the express prior written
                    consent of YOH Underground.
                    <br /><br />
                    This obligation of confidentiality shall survive the termination of the Member's association with YOH Underground.
                    Any breach of this Agreement may result in immediate termination of membership and potential legal action.
                    By clicking "I Agree," the Member affirms their understanding and commitment to this Non-Disclosure Agreement.
                    {/* End NDA text placeholder */}
                </p>
                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                <button
                    onClick={handleAcceptNda}
                    disabled={isLoading}
                    className="w-full btn-primary py-3 px-12 rounded-md text-lg mt-6"
                >
                    {isLoading ? 'Accepting...' : 'I Agree to the NDA'}
                </button>
            </div>
        </div>
    );
};

export default NDAAcceptanceScreen;