// File: src/components/AdminResourceManagementScreen.tsx - FINAL CORRECTED (Syntax & Structure Fix)

import React, { useState, useEffect } from 'react';
import { Resource, UserData } from '../types'; // Import Resource and UserData types

// Define the shape of an Admin form for creating/editing a resource
interface ResourceFormData {
    id?: string; // Only for editing existing
    title: string;
    description: string;
    type: 'Document' | 'Link' | 'Download' | 'Contact Info';
    url: string; // URL for external links or Firebase Storage path for downloads
    accessLevel: 'All Members' | 'Specific Networks' | 'Admin Only';
    networkIds: string[]; // Array of network IDs if accessLevel is 'Specific Networks'
}

interface AdminResourceManagementScreenProps {
    // No props needed for now, component manages its own state
}

const AdminResourceManagementScreen: React.FC<AdminResourceManagementScreenProps> = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showForm, setShowForm] = useState(false); // To show/hide create/edit form
    const [currentResource, setCurrentResource] = useState<ResourceFormData | null>(null); // For editing
    const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>(''); // For filtering resources

    const adminToken = localStorage.getItem('yoh_token'); // Admin's JWT

    // Predefined types and access levels for dropdowns
    const resourceTypes = ['Document', 'Link', 'Download', 'Contact Info'];
    const accessLevels = ['All Members', 'Specific Networks', 'Admin Only'];

    // Function to fetch all resources
    const fetchResources = async (filterType?: string) => {
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

            const queryString = queryParams.toString();
            const response = await fetch(`https://yoh-underground-server.vercel.app/api/admin/resources${queryString ? `?${queryString}` : ''}`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch resources.');
            }

            const data = await response.json();
            setResources(data.resources || []);
        } catch (err: any) {
            setError(err.message || 'Error fetching resources.');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch and fetch when filter changes
    useEffect(() => {
        fetchResources(selectedTypeFilter);
    }, [adminToken, selectedTypeFilter]);


    // Handle form input changes for currentResource (create/edit)
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentResource(prev => ({ ...prev!, [name]: value }));
    };

    // Handle network IDs input (comma-separated string of Network IDs)
    const handleNetworkIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const ids = e.target.value.split(',').map(id => id.trim()).filter(id => id);
        setCurrentResource(prev => ({ ...prev!, networkIds: ids }));
    };


    // Handle form submission (Create or Update)
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!adminToken || !currentResource) {
            setError('Admin token or resource data missing.');
            setIsSubmitting(false);
            return;
        }

        try {
            const method = currentResource.id ? 'PUT' : 'POST';
            const url = currentResource.id ?
                `https://yoh-underground-server.vercel.app/api/admin/resources/${currentResource.id}` :
                'https://yoh-underground-server.vercel.app/api/admin/resources';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(currentResource) // Send current form data
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${currentResource.id ? 'update' : 'create'} resource.`);
            }

            alert(`Resource ${currentResource.id ? 'updated' : 'created'} successfully!`);
            setShowForm(false);
            setCurrentResource(null);
            fetchResources(selectedTypeFilter); // Re-fetch all to update list

        } catch (err: any) {
            setError(err.message || `Error ${currentResource.id ? 'updating' : 'creating'} resource.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Edit button click
    const handleEditClick = (resource: Resource) => {
        setCurrentResource({
            ...resource,
            description: resource.description || '', // Default optional to empty string
            url: resource.url || '', // Default optional to empty string
            networkIds: resource.networkIds || [] // Ensure it's an array
        });
        setShowForm(true);
    };

    // Handle Delete button click
    const handleDeleteClick = async (resourceId: string) => {
        if (!adminToken) {
            alert('Admin token not found.');
            return;
        }
        if (!window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
            return;
        }

        setLoading(true); // Indicate loading while deleting
        setError(null);

        try {
            const response = await fetch(`https://yoh-underground-server.vercel.app/api/admin/resources/${resourceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete resource.');
            }

            alert('Resource deleted successfully!');
            fetchResources(selectedTypeFilter); // Re-fetch to update the list
        } catch (err: any) {
            setError(err.message || 'Error deleting resource.');
        } finally {
            setLoading(false);
        }
    };


    if (loading && !resources.length && !showForm) { // Only show global loading if no resources loaded yet
        return <div className="text-center py-8">Loading resources...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-8 bg-[#0A0A0A] rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 accent-gold">Admin: Resource Management</h1>

            <div className="mb-6 flex items-center space-x-4">
                <button
                    onClick={() => { setShowForm(true); setCurrentResource({ title: '', description: '', type: 'Document', url: '', accessLevel: 'All Members', networkIds: [] }); }}
                    className="btn-primary py-2 px-4 rounded-md"
                >
                    Create New Resource
                </button>
                <select
                    value={selectedTypeFilter}
                    onChange={(e) => setSelectedTypeFilter(e.target.value)}
                    className="flex-1 bg-[#1A1A1A] text-white border border-gray-700 rounded-md p-2"
                >
                    <option value="">Filter by Type (All)</option>
                    {resourceTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>

            {showForm && (
                <div className="bg-[#1A1A1A] p-6 rounded-lg mb-6 shadow-xl border border-gray-700">
                    <h2 className="text-2xl font-semibold mb-4 text-white">{currentResource?.id ? 'Edit Resource' : 'Create New Resource'}</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={currentResource?.title || ''}
                                onChange={handleFormChange}
                                required
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">Description (Optional):</label>
                            <textarea
                                name="description"
                                value={currentResource?.description || ''}
                                onChange={handleFormChange}
                                rows={3}
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">Type:</label>
                            <select
                                name="type"
                                value={currentResource?.type || 'Document'}
                                onChange={handleFormChange}
                                required
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            >
                                {resourceTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">URL / Path (Optional, depends on type):</label>
                            <input
                                type="text"
                                name="url"
                                value={currentResource?.url || ''}
                                onChange={handleFormChange}
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">Access Level:</label>
                            <select
                                name="accessLevel"
                                value={currentResource?.accessLevel || 'All Members'}
                                onChange={handleFormChange}
                                required
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            >
                                {accessLevels.map(level => <option key={level} value={level}>{level}</option>)}
                            </select>
                        </div>
                        {currentResource?.accessLevel === 'Specific Networks' && (
                            <div>
                                <label className="block text-gray-400 text-sm font-bold mb-1">Network IDs (comma-separated):</label>
                                <input
                                    type="text"
                                    name="networkIds"
                                    value={currentResource?.networkIds.join(', ') || ''}
                                    onChange={handleNetworkIdsChange}
                                    className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                                />
                            </div>
                        )}

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
                                {isSubmitting ? 'Saving...' : 'Save Resource'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Resources List */}
            <div className="mt-8">
                {resources.length === 0 && !loading && !showForm ? (
                    <p className="text-center text-gray-400">No resources found. Create one to get started!</p>
                ) : (
                    <div className="space-y-4">
                        {resources.map(resource => (
                            <div key={resource.id} className="border border-gray-700 rounded-md p-4 bg-[#1A1A1A] shadow-md">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-xl font-semibold text-white">{resource.title}</h2>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${resource.accessLevel === 'Admin Only' ? 'bg-red-600 text-white' :
                                            resource.accessLevel === 'Specific Networks' ? 'bg-yellow-600 text-white' :
                                                'bg-blue-600 text-white'
                                        }`}>
                                        {resource.accessLevel}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-1">Type: {resource.type}</p>
                                {resource.url && <p className="text-gray-400 text-sm mb-1">URL/Path: {resource.url}</p>}
                                {resource.description && <p className="text-gray-300 text-sm mb-2">{resource.description}</p>}
                                {resource.accessLevel === 'Specific Networks' && resource.networkIds && resource.networkIds.length > 0 && (
                                    <p className="text-gray-500 text-xs">Networks: {resource.networkIds.join(', ')}</p>
                                )}
                                <p className="text-gray-500 text-xs">Created: {resource.createdAt ? new Date(resource.createdAt).toLocaleString() : 'N/A'}</p>

                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        onClick={() => handleEditClick(resource)}
                                        className="btn-secondary py-1 px-3 rounded-md text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(resource.id)}
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

export default AdminResourceManagementScreen;