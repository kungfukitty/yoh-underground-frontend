// File: src/components/AdminNetworkManagementScreen.tsx - FINAL CORRECTED (All Syntax Errors Resolved)

import React, { useState, useEffect } from 'react';
import { Network, UserData } from '../types'; // Import Network and UserData types

// Define the shape of an Admin form for creating/editing a network
interface NetworkFormData {
    id?: string; // Only for editing existing
    name: string;
    description: string;
    type: 'Professional' | 'Social' | 'Interest-Based';
    members: string[]; // Array of user IDs
    visibility: 'Public' | 'Private';
}

interface AdminNetworkManagementScreenProps {
    // No props needed for now, component manages its own state
}

const AdminNetworkManagementScreen: React.FC<AdminNetworkManagementScreenProps> = () => {
    const [networks, setNetworks] = useState<Network[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showForm, setShowForm] = useState(false); // To show/hide create/edit form
    const [currentNetwork, setCurrentNetwork] = useState<NetworkFormData | null>(null); // For editing
    const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>(''); // For filtering networks

    const adminToken = localStorage.getItem('yoh_token'); // Admin's JWT

    // Predefined types and visibilities for dropdowns/checkboxes
    const networkTypes = ['Professional', 'Social', 'Interest-Based'];
    const networkVisibilities = ['Public', 'Private'];

    // Function to fetch all networks
    const fetchNetworks = async (filterType?: string, filterVisibility?: string) => {
        if (!adminToken) {
            setError('Admin authentication token not found. Please log in as an admin.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams();
            if (filterType) queryParams.append('type', filterType);
            if (filterVisibility) queryParams.append('visibility', filterVisibility);

            const queryString = queryParams.toString();
            const response = await fetch(`https://yoh-underground-server.vercel.app/api/admin/networks${queryString ? `?${queryString}` : ''}`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch networks.');
            }

            const data = await response.json();
            setNetworks(data.networks || []);
        } catch (err: any) {
            setError(err.message || 'Error fetching networks.');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch and fetch when filter changes
    useEffect(() => {
        fetchNetworks(selectedTypeFilter); // For simplicity, only filtering by type for now
    }, [adminToken, selectedTypeFilter]);


    // Handle form input changes for currentNetwork (create/edit)
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentNetwork(prev => ({ ...prev!, [name]: value }));
    };

    // Handle members input (comma-separated string of User IDs)
    const handleMembersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const ids = e.target.value.split(',').map(id => id.trim()).filter(id => id);
        setCurrentNetwork(prev => ({ ...prev!, members: ids }));
    };

    // Handle form submission (Create or Update)
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!adminToken || !currentNetwork) {
            setError('Admin token or network data missing.');
            setIsSubmitting(false);
            return;
        }

        try {
            const method = currentNetwork.id ? 'PUT' : 'POST';
            const url = currentNetwork.id ?
                `https://yoh-underground-server.vercel.app/api/admin/networks/${currentNetwork.id}` :
                'https://yoh-underground-server.vercel.app/api/admin/networks';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(currentNetwork) // Send current form data
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${currentNetwork.id ? 'update' : 'create'} network.`);
            }

            alert(`Network ${currentNetwork.id ? 'updated' : 'created'} successfully!`);
            setShowForm(false);
            setCurrentNetwork(null);
            fetchNetworks(selectedTypeFilter); // Re-fetch all to update list

        } catch (err: any) {
            setError(err.message || `Error ${currentNetwork.id ? 'updating' : 'creating'} network.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Edit button click
    const handleEditClick = (network: Network) => {
        setCurrentNetwork({
            ...network,
            description: network.description || '', // Default optional to empty string
            members: network.members || [] // Ensure members is an array
        });
        setShowForm(true);
    };

    // Handle Delete button click
    const handleDeleteClick = async (networkId: string) => {
        if (!adminToken) {
            alert('Admin token not found.');
            return;
        }
        if (!window.confirm('Are you sure you want to delete this network? This action cannot be undone.')) {
            return;
        }

        setLoading(true); // Indicate loading while deleting
        setError(null);

        try {
            const response = await fetch(`https://yoh-underground-server.vercel.app/api/admin/networks/${networkId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete network.');
            }

            alert('Network deleted successfully!');
            fetchNetworks(selectedTypeFilter); // Re-fetch to update the list
        } catch (err: any) {
            setError(err.message || 'Error deleting network.');
        } finally {
            setLoading(false);
        }
    };


    if (loading && !networks.length && !showForm) { // Only show global loading if no networks loaded yet
        return <div className="text-center py-8">Loading networks...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-8 bg-[#0A0A0A] rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 accent-gold">Admin: Network Management</h1>

            <div className="mb-6 flex items-center space-x-4">
                <button
                    onClick={() => { setShowForm(true); setCurrentNetwork({ name: '', description: '', type: 'Professional', members: [], visibility: 'Public' }); }}
                    className="btn-primary py-2 px-4 rounded-md"
                >
                    Create New Network
                </button>
                <select
                    value={selectedTypeFilter}
                    onChange={(e) => setSelectedTypeFilter(e.target.value)}
                    className="flex-1 bg-[#1A1A1A] text-white border border-gray-700 rounded-md p-2"
                >
                    <option value="">Filter by Type (All)</option>
                    {networkTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>

            {showForm && (
                <div className="bg-[#1A1A1A] p-6 rounded-lg mb-6 shadow-xl border border-gray-700">
                    <h2 className="text-2xl font-semibold mb-4 text-white">{currentNetwork?.id ? 'Edit Network' : 'Create New Network'}</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={currentNetwork?.name || ''}
                                onChange={handleFormChange}
                                required
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">Description (Optional):</label>
                            <textarea
                                name="description"
                                value={currentNetwork?.description || ''}
                                onChange={handleFormChange}
                                rows={3}
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">Type:</label>
                            <select
                                name="type"
                                value={currentNetwork?.type || 'Professional'}
                                onChange={handleFormChange}
                                required
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            >
                                {networkTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">Visibility:</label>
                            <select
                                name="visibility"
                                value={currentNetwork?.visibility || 'Public'}
                                onChange={handleFormChange}
                                required
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            >
                                {networkVisibilities.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">Members (User IDs, comma-separated):</label>
                            <input
                                type="text"
                                name="members"
                                value={currentNetwork?.members.join(', ') || ''}
                                onChange={handleMembersChange}
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            />
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
                                {isSubmitting ? 'Saving...' : 'Save Network'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Networks List */}
            <div className="mt-8">
                {networks.length === 0 && !loading && !showForm ? (
                    <p className="text-center text-gray-400">No networks found. Create one to get started!</p>
                ) : (
                    <div className="space-y-4">
                        {networks.map(network => (
                            <div key={network.id} className="border border-gray-700 rounded-md p-4 bg-[#1A1A1A] shadow-md">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-xl font-semibold text-white">{network.name}</h2>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${network.visibility === 'Public' ? 'bg-blue-600 text-white' : 'bg-orange-600 text-white'
                                        }`}>
                                        {network.visibility}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-1">Type: {network.type}</p>
                                {network.description && <p className="text-gray-300 text-sm mb-2">{network.description}</p>}
                                <p className="text-gray-500 text-xs">Members: {network.members?.length || 0}</p>
                                <p className="text-gray-500 text-xs">Created: {network.createdAt ? new Date(network.createdAt).toLocaleString() : 'N/A'}</p>

                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        onClick={() => handleEditClick(network)}
                                        className="btn-secondary py-1 px-3 rounded-md text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(network.id)}
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

export default AdminNetworkManagementScreen;
