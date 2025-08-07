// File: src/components/ProfileScreen.tsx

import React, { useState, useEffect } from 'react';
import { UserData } from '../types'; // Import UserData for type checking

interface ProfileScreenProps {
    // No props needed for this component, it fetches its own data
}

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
    // --- STATE DECLARATIONS ---
    const [profile, setProfile] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<UserData>>({});

    const userToken = localStorage.getItem('yoh_token');
    // --- END STATE DECLARATIONS ---

    // Fetch user profile on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            if (!userToken) {
                setError('Authentication token not found.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('https://yoh-underground-server.vercel.app/api/member/profile', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch profile.');
                }

                const data = await response.json();
                setProfile(data.profile);
                setFormData(data.profile); // Initialize form data with fetched profile
            } catch (err: any) {
                setError(err.message || 'Error fetching profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userToken]); // Depend on userToken to re-fetch if it changes

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission (update profile)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!userToken) {
            setError('Authentication token not found.');
            setLoading(false);
            return;
        }

        const allowedUpdateFields: (keyof UserData)[] = ['name', 'status']; // Fields allowed to be updated by this form

        const updatesToSend = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) =>
                allowedUpdateFields.includes(key as keyof UserData) && value !== undefined
            )
        ) as Partial<UserData>;

        try {
            const response = await fetch('https://yoh-underground-server.vercel.app/api/member/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatesToSend)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile.');
            }

            const updatedData = await response.json();
            // Corrected type for prevProfile parameter
            setProfile((prevProfile: UserData | null) => ({ ...(prevProfile as UserData), ...updatesToSend })); // Fix for prevProfile any type
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (err: any) {
            setError(err.message || 'Error updating profile.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading profile...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    if (!profile) {
        return <div className="text-center py-8">No profile data found.</div>;
    }

    return (
        <div className="p-8 bg-[#0A0A0A] rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 accent-gold">My Profile</h1>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
                            Email (Read-only)
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={profile.email}
                            readOnly
                            className="w-full bg-[#1A1A1A] text-gray-500 border border-gray-700 rounded-md p-3 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            className="w-full bg-[#1A1A1A] text-white border border-gray-700 rounded-md p-3 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="status">
                            Status
                        </label>
                        <input
                            type="text"
                            id="status"
                            name="status"
                            value={formData.status || ''}
                            onChange={handleInputChange}
                            className="w-full bg-[#1A1A1A] text-white border border-gray-700 rounded-md p-3 transition"
                        />
                    </div>
                    {/* Add more editable fields as needed based on your UserData */}
                    {/* Remember to add them to `allowedUpdateFields` above as well */}

                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={() => { setIsEditing(false); setFormData(profile); }}
                            className="btn-secondary py-2 px-6 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary py-2 px-6 rounded-md"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-4">
                    <p><span className="text-gray-400 font-semibold">Email:</span> {profile.email}</p>
                    <p><span className="text-gray-400 font-semibold">Name:</span> {profile.name || 'N/A'}</p>
                    <p><span className="text-gray-400 font-semibold">Status:</span> {profile.status || 'N/A'}</p>
                    <p><span className="text-gray-400 font-semibold">Admin:</span> {profile.isAdmin ? 'Yes' : 'No'}</p>
                    <p><span className="text-gray-400 font-semibold">NDA Accepted:</span> {profile.isNDAAccepted ? 'Yes' : 'No'}</p>
                    <p><span className="text-gray-400 font-semibold">NDA Accepted At:</span> {profile.ndaAcceptedAt ? new Date(profile.ndaAcceptedAt).toLocaleString() : 'N/A'}</p>
                    {/* Add more display fields as needed */}

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn-primary py-2 px-6 rounded-md"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileScreen;