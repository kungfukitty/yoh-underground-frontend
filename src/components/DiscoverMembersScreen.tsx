// File: src/components/DiscoverMembersScreen.tsx - FINAL CORRECTED (Syntax Fix)

import React, { useState, useEffect } from 'react'; // CORRECTED: Added 'from 'react''
import { UserData } from '../types';

interface DiscoverMembersScreenProps {
    // No props needed for now, component fetches its own data
}

const DiscoverMembersScreen: React.FC<DiscoverMembersScreenProps> = () => {
    const [members, setMembers] = useState<Partial<UserData>[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userToken = localStorage.getItem('yoh_token');
    const currentUserId = JSON.parse(localStorage.getItem('yoh_user') || '{}').id;

    const fetchDiscoverableMembers = async () => {
        if (!userToken) {
            setError('Authentication token not found. Please log in.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://yoh-underground-server.vercel.app/api/member/discover', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch discoverable members.');
                } else {
                    const errorText = await response.text();
                    console.error("Server returned non-JSON response:", errorText);
                    throw new Error('An unexpected non-JSON error occurred from the server. Please try again later.');
                }
            }

            const data = await response.json();
            if (Array.isArray(data.members)) {
                setMembers(data.members);
            } else {
                console.warn("Backend /api/member/discover returned unexpected data format for 'members':", data.members);
                setMembers([]);
            }
        } catch (err: any) {
            setError(err.message || 'Error fetching discoverable members.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscoverableMembers();
    }, [userToken, currentUserId]);

    if (loading) {
        return <div className="text-center py-8">Searching for members...</div>;
    }

    if (error) {
        return (
            <div className="p-8 bg-[#0A0A0A] rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 accent-gold">Discover Members</h1>
                <p className="text-gray-400 mb-6">Connect with other vetted peers in the YOH Underground brotherhood.</p>
                <div className="text-center py-8 text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <div className="p-8 bg-[#0A0A0A] rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 accent-gold">Discover Members</h1>
                <p className="text-gray-400 mb-6">Connect with other vetted peers in the YOH Underground brotherhood.</p>
                <div className="text-center py-8 text-gray-400">No discoverable members found at this time.</div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-[#0A0A0A] rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 accent-gold">Discover Members</h1>
            <p className="text-gray-400 mb-6">Connect with other vetted peers in the YOH Underground brotherhood.</p>

            <div className="space-y-4">
                {members.map(member => (
                    <div key={member.id} className="border border-gray-700 rounded-md p-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-white">{member.name || member.email?.split('@')[0] || 'Unknown Member'}</h2>
                            {member.status && <p className="text-gray-500 text-sm">{member.status}</p>}
                            {member.connectionInterests && member.connectionInterests.length > 0 && (
                                <p className="text-gray-400 text-xs mt-1">
                                    Interests: {member.connectionInterests.join(', ')}
                                </p>
                            )}
                        </div>
                        {/* Future: Add a "Request Connection" button here */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiscoverMembersScreen;