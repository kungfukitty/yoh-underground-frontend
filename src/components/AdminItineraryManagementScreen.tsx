// File: src/components/AdminItineraryManagementScreen.tsx - FINAL CORRECTED (Syntax & Structure Fix)

import React, { useState, useEffect } from 'react';
import { Itinerary, ItineraryActivity, UserData } from '../types'; // Import Itinerary and UserData types

// Define the shape of an Admin form for creating/editing an itinerary
// This mirrors the Itinerary interface but with dates as strings for form inputs
interface ItineraryFormData {
    id?: string; // Only for editing existing
    userId: string;
    name: string;
    description: string; // Ensure this is always a string for the form
    startDate: string; // ISO string for form input
    endDate: string;   // ISO string for form input
    status: 'Draft' | 'Planned' | 'Active' | 'Completed' | 'Cancelled';
    details: ItineraryActivity[]; // Array of activity objects
}

interface AdminItineraryManagementScreenProps {
    // No props needed for now, component manages its own state
}

const AdminItineraryManagementScreen: React.FC<AdminItineraryManagementScreenProps> = () => {
    const [itineraries, setItineraries] = useState<Itinerary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showForm, setShowForm] = useState(false); // To show/hide create/edit form
    const [currentItinerary, setCurrentItinerary] = useState<ItineraryFormData | null>(null); // For editing
    const [selectedUserId, setSelectedUserId] = useState<string>(''); // For filtering itineraries

    const adminToken = localStorage.getItem('yoh_token'); // Admin's JWT

    // Predefined statuses for dropdown
    const itineraryStatuses = ['Draft', 'Planned', 'Active', 'Completed', 'Cancelled'];

    // Function to fetch all itineraries
    const fetchItineraries = async (filterUserId?: string) => {
        if (!adminToken) {
            setError('Admin authentication token not found. Please log in as an admin.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const queryParam = filterUserId ? `?userId=${filterUserId}` : '';
            const response = await fetch(`https://yoh-underground-server.vercel.app/api/admin/itineraries${queryParam}`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch itineraries.');
            }

            const data = await response.json();
            setItineraries(data.itineraries || []);
        } catch (err: any) {
            setError(err.message || 'Error fetching itineraries.');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch and fetch when filter changes
    useEffect(() => {
        fetchItineraries(selectedUserId);
    }, [adminToken, selectedUserId]);


    // Handle form input changes for currentItinerary (create/edit)
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentItinerary(prev => ({ ...prev!, [name]: value }));
    };

    // Handle activity detail changes (nested array)
    const handleActivityChange = (index: number, field: keyof ItineraryActivity, value: string) => {
        setCurrentItinerary(prev => {
            const updatedDetails = [...prev!.details];
            updatedDetails[index] = { ...updatedDetails[index], [field]: value };
            return { ...prev!, details: updatedDetails };
        });
    };

    const addActivity = () => {
        setCurrentItinerary(prev => ({
            ...prev!,
            details: [
                ...prev!.details,
                { date: '', description: '', location: '', notes: '' } // New empty activity with notes field
            ]
        }));
    };

    const removeActivity = (index: number) => {
        setCurrentItinerary(prev => ({
            ...prev!,
            details: prev!.details.filter((_, i) => i !== index)
        }));
    };

    // Handle form submission (Create or Update)
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!adminToken || !currentItinerary) {
            setError('Admin token or itinerary data missing.');
            setIsSubmitting(false);
            return;
        }

        try {
            const method = currentItinerary.id ? 'PUT' : 'POST';
            const url = currentItinerary.id ?
                `https://yoh-underground-server.vercel.app/api/admin/itineraries/${currentItinerary.id}` :
                'https://yoh-underground-server.vercel.app/api/admin/itineraries';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(currentItinerary) // Send current form data
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${currentItinerary.id ? 'update' : 'create'} itinerary.`);
            }

            alert(`Itinerary ${currentItinerary.id ? 'updated' : 'created'} successfully!`);
            setShowForm(false);
            setCurrentItinerary(null);
            fetchItineraries(selectedUserId); // Re-fetch all to update list

        } catch (err: any) {
            setError(err.message || `Error ${currentItinerary.id ? 'updating' : 'creating'} itinerary.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Edit/View button click
    const handleEditClick = (itinerary: Itinerary) => {
        // Convert dates from ISO string back to correct format for datetime-local/date inputs
        setCurrentItinerary({
            ...itinerary,
            startDate: itinerary.startDate ? itinerary.startDate.substring(0, 10) : '', // YYYY-MM-DD
            endDate: itinerary.endDate ? itinerary.endDate.substring(0, 10) : '',     // YYYY-MM-DD
            description: itinerary.description || '', // Provide empty string if undefined
            details: itinerary.details.map(detail => ({
                ...detail,
                date: detail.date ? detail.date.substring(0, 16) : '', // YYYY-MM-DDTHH:mm for datetime-local
                description: detail.description || '', // Provide empty string if undefined
                location: detail.location || '', // Provide empty string if undefined
                notes: detail.notes || '' // Provide empty string if undefined
            }))
        });
        setShowForm(true);
    };

    // Handle Delete button click
    const handleDeleteClick = async (itineraryId: string) => {
        if (!adminToken) {
            alert('Admin token not found.');
            return;
        }
        if (!window.confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) {
            return;
        }

        setLoading(true); // Indicate loading while deleting
        setError(null);

        try {
            const response = await fetch(`https://yoh-underground-server.vercel.app/api/admin/itineraries/${itineraryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete itinerary.');
            }

            alert('Itinerary deleted successfully!');
            fetchItineraries(selectedUserId); // Re-fetch to update the list
        } catch (err: any) {
            setError(err.message || 'Error deleting itinerary.');
        } finally {
            setLoading(false);
        }
    };


    if (loading && !itineraries.length && !showForm) { // Only show global loading if no itineraries loaded yet
        return <div className="text-center py-8">Loading itineraries...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    // Main render function for the component
    return (
        <div className="p-8 bg-[#0A0A0A] rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 accent-gold">Admin: Itinerary Management</h1>

            <div className="mb-6 flex items-center space-x-4">
                <button
                    onClick={() => { setShowForm(true); setCurrentItinerary({ userId: '', name: '', description: '', startDate: '', endDate: '', status: 'Draft', details: [] }); }}
                    className="btn-primary py-2 px-4 rounded-md"
                >
                    Create New Itinerary
                </button>
                <input
                    type="text"
                    placeholder="Filter by User ID (optional)"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="flex-1 bg-[#1A1A1A] text-white border border-gray-700 rounded-md p-2"
                />
            </div>

            {showForm && (
                <div className="bg-[#1A1A1A] p-6 rounded-lg mb-6 shadow-xl border border-gray-700">
                    <h2 className="text-2xl font-semibold mb-4 text-white">{currentItinerary?.id ? 'Edit Itinerary' : 'Create New Itinerary'}</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">User ID:</label>
                            <input
                                type="text"
                                name="userId"
                                value={currentItinerary?.userId || ''}
                                onChange={handleFormChange}
                                required
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={currentItinerary?.name || ''}
                                onChange={handleFormChange}
                                required
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">Description:</label>
                            <textarea
                                name="description"
                                value={currentItinerary?.description || ''}
                                onChange={handleFormChange}
                                rows={3}
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            ></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm font-bold mb-1">Start Date:</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={currentItinerary?.startDate || ''}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm font-bold mb-1">End Date:</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={currentItinerary?.endDate || ''}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">Status:</label>
                            <select
                                name="status"
                                value={currentItinerary?.status || 'Draft'}
                                onChange={handleFormChange}
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            >
                                {itineraryStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {/* Itinerary Activities */}
                        <div className="border border-gray-600 p-4 rounded-md">
                            <h3 className="text-xl font-semibold mb-3 text-white">Activities</h3>
                            {currentItinerary?.details.map((activity, index) => (
                                <div key={index} className="bg-gray-800 p-3 rounded-md mb-3 space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-gray-400 text-xs font-bold mb-1">Date/Time:</label>
                                            <input
                                                type="datetime-local"
                                                value={activity.date || ''}
                                                onChange={(e) => handleActivityChange(index, 'date', e.target.value)}
                                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-xs font-bold mb-1">Location:</label>
                                            <input
                                                type="text"
                                                value={activity.location || ''}
                                                onChange={(e) => handleActivityChange(index, 'location', e.target.value)}
                                                placeholder="Location"
                                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-xs font-bold mb-1">Description:</label>
                                        <textarea
                                            value={activity.description || ''}
                                            onChange={(e) => handleActivityChange(index, 'description', e.target.value)}
                                            placeholder="Description"
                                            rows={2}
                                            className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2 text-sm"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-xs font-bold mb-1">Notes (Optional):</label>
                                        <textarea
                                            value={activity.notes || ''}
                                            onChange={(e) => handleActivityChange(index, 'notes', e.target.value)}
                                            placeholder="Notes"
                                            rows={1}
                                            className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2 text-sm"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeActivity(index)}
                                        className="btn-secondary text-red-400 hover:text-red-600 py-1 px-2 rounded-md text-xs"
                                    >
                                        Remove Activity
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addActivity}
                                className="btn-secondary py-2 px-4 rounded-md text-sm mt-3"
                            >
                                Add Activity
                            </button>
                        </div>


                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="btn-secondary py-2 px-6 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary py-2 px-6 rounded-md"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Itinerary'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Itineraries List */}
            <div className="mt-8">
                {itineraries.length === 0 && !loading && !showForm ? (
                    <p className="text-center text-gray-400">No itineraries found. Create one to get started!</p>
                ) : (
                    <div className="space-y-4">
                        {itineraries.map(itinerary => (
                            <div key={itinerary.id} className="border border-gray-700 rounded-md p-4 bg-[#1A1A1A] shadow-md">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-xl font-semibold text-white">{itinerary.name}</h2>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${itinerary.status === 'Active' ? 'bg-green-600 text-white' :
                                            itinerary.status === 'Planned' ? 'bg-blue-600 text-white' :
                                                itinerary.status === 'Draft' ? 'bg-gray-600 text-white' : 'bg-red-600 text-white'
                                        }`}>
                                        {itinerary.status}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-2">Member ID: {itinerary.userId}</p>
                                <p className="text-gray-400 text-sm mb-2">
                                    {itinerary.startDate ? new Date(itinerary.startDate).toLocaleDateString() : 'N/A'} -
                                    {itinerary.endDate ? new Date(itinerary.endDate).toLocaleDateString() : 'N/A'}
                                </p>
                                {itinerary.description && <p className="text-gray-300 text-sm mb-3">{itinerary.description}</p>}
                                <p className="text-gray-500 text-xs">Activities: {itinerary.details?.length || 0}</p>

                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        onClick={() => handleEditClick(itinerary)}
                                        className="btn-secondary py-1 px-3 rounded-md text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(itinerary.id)}
                                        className="bg-red-700/80 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminItineraryManagementScreen;