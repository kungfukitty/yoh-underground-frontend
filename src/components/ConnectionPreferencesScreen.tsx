// File: src/components/ConnectionPreferencesScreen.tsx

import React, { useState, useEffect } from 'react';
import { UserData } from '../types'; // Import UserData for type checking

const predefinedInterests = [
    'Finance', 'Technology', 'Real Estate', 'Arts & Culture', 'Travel', 'Automotive',
    'Yachting', 'Aviation', 'Philanthropy', 'Sports', 'Fine Dining', 'Adventure',
    'Fashion', 'Media', 'Law', 'Medicine', 'Hospitality', 'Luxury Goods'
];

const ConnectionPreferencesScreen: React.FC = () => {
    const [profile, setProfile] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form data states
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [visibility, setVisibility] = useState<'Visible to all members' | 'Visible to members with shared interests' | 'Not visible for connections'>('Not visible for connections');

    const userToken = localStorage.getItem('yoh_token');
    const userId = JSON.parse(localStorage.getItem('yoh_user') || '{}').id;

    // Fetch user's current connection preferences
    useEffect(() => {
        const fetchPreferences = async () => {
            if (!userToken || !userId) {
                setError('Authentication error. Please log in.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('https://yoh-underground-server.vercel.app/api/member/profile', { // Fetch full profile to get interests
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch connection preferences.');
                }

                const data = await response.json();
                setProfile(data.profile);
                setSelectedInterests(data.profile.connectionInterests || []);
                setVisibility(data.profile.connectionVisibility || 'Not visible for connections');
            } catch (err: any) {
                setError(err.message || 'Error fetching connection preferences.');
            } finally {
                setLoading(false);
            }
        };

        fetchPreferences();
    }, [userToken, userId]);

    const handleInterestChange = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        if (!userToken) {
            setError('Authentication error. Please log in.');
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch('https://yoh-underground-server.vercel.app/api/member/connection-preferences', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    connectionInterests: selectedInterests,
                    connectionVisibility: visibility,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update preferences.');
            }

            alert('Connection preferences updated successfully!');
            // Optionally refetch profile to ensure consistency, or update local state
            setProfile(prev => ({
                ...(prev as UserData),
                connectionInterests: selectedInterests,
                connectionVisibility: visibility
            }));
        } catch (err: any) {
            setError(err.message || 'Error saving preferences.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading connection preferences...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-8 bg-[#0A0A0A] rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 accent-gold">Connection Preferences</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h2 className="text-xl text-white mb-3">Your Interests</h2>
                    <p className="text-gray-400 text-sm mb-4">Select areas you're interested in for connecting with other members.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {predefinedInterests.map(interest => (
                            <label key={interest} className="inline-flex items-center text-gray-300">
                                <input
                                    type="checkbox"
                                    value={interest}
                                    checked={selectedInterests.includes(interest)}
                                    onChange={() => handleInterestChange(interest)}
                                    className="form-checkbox h-5 w-5 text-accent-gold rounded border-gray-700 bg-[#1A1A1A]"
                                />
                                <span className="ml-2">{interest}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl text-white mb-3">Your Visibility</h2>
                    <p className="text-gray-400 text-sm mb-4">Control who can discover you for connections.</p>
                    {['Visible to all members', 'Visible to members with shared interests', 'Not visible for connections'].map(option => (
                        <label key={option} className="block items-center text-gray-300 mb-2">
                            <input
                                type="radio"
                                name="visibility"
                                value={option}
                                checked={visibility === option}
                                onChange={() => setVisibility(option as any)} // Cast to any to bypass TS for literal type
                                className="form-radio h-5 w-5 text-accent-gold border-gray-700 bg-[#1A1A1A]"
                            />
                            <span className="ml-2">{option}</span>
                        </label>
                    ))}
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="btn-primary py-2 px-6 rounded-md"
                    >
                        {isSaving ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConnectionPreferencesScreen;