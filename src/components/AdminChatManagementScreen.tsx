// File: src/components/AdminChatManagementScreen.tsx

import React, { useState, useEffect } from 'react';
import { ChatLog, ChatMessage, UserData } from '../types'; // Import ChatLog, ChatMessage, UserData types

// Define the shape of an Admin form for creating/editing a chat log
interface ChatLogFormData {
    id?: string; // Only for editing existing
    userIds: string[];
    messages: ChatMessage[];
    itineraryId: string; // Should be optional, but required in form for now
    subject: string;
    status: 'Open' | 'Closed' | 'Archived';
}

interface AdminChatManagementScreenProps {
    // No props needed for now, component manages its own state
}

const AdminChatManagementScreen: React.FC<AdminChatManagementScreenProps> = () => {
    const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showForm, setShowForm] = useState(false); // To show/hide create/edit form
    const [currentChatLog, setCurrentChatLog] = useState<ChatLogFormData | null>(null); // For editing
    const [selectedUserIdFilter, setSelectedUserIdFilter] = useState<string>(''); // For filtering chat logs

    const adminToken = localStorage.getItem('yoh_token'); // Admin's JWT
    const adminUserId = JSON.parse(localStorage.getItem('yoh_user') || '{}').id; // Admin user ID

    // Predefined statuses for dropdown
    const chatStatuses = ['Open', 'Closed', 'Archived'];

    // Function to fetch all chat logs
    const fetchChatLogs = async (filterUserId?: string) => {
        if (!adminToken) {
            setError('Admin authentication token not found. Please log in as an admin.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const queryParam = filterUserId ? `?userId=${filterUserId}` : '';
            const response = await fetch(`https://yoh-underground-server-i7pg.onrender.com`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch chat logs.');
            }

            const data = await response.json();
            setChatLogs(data.chatLogs || []);
        } catch (err: any) {
            setError(err.message || 'Error fetching chat logs.');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch and fetch when filter changes
    useEffect(() => {
        fetchChatLogs(selectedUserIdFilter);
    }, [adminToken, selectedUserIdFilter]);


    // Handle form input changes for currentChatLog (create/edit)
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentChatLog(prev => ({ ...prev!, [name]: value }));
    };

    // Handle userIds input (comma-separated string)
    const handleUserIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const ids = e.target.value.split(',').map(id => id.trim()).filter(id => id);
        setCurrentChatLog(prev => ({ ...prev!, userIds: ids }));
    };

    // Handle adding a new message to current chat log
    const handleAddMessage = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form submission
        const messageInput = (e.target as HTMLFormElement).elements.namedItem('newMessageText') as HTMLInputElement;
        const messageText = messageInput.value.trim();

        if (messageText && currentChatLog) {
            const newMessage: ChatMessage = {
                senderId: adminUserId, // Admin is sending the message
                text: messageText,
                timestamp: new Date().toISOString()
            };
            setCurrentChatLog(prev => ({
                ...prev!,
                messages: [...(prev?.messages || []), newMessage]
            }));
            messageInput.value = ''; // Clear input
        }
    };

    // Handle form submission (Create or Update chat log)
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!adminToken || !currentChatLog) {
            setError('Admin token or chat log data missing.');
            setIsSubmitting(false);
            return;
        }

        try {
            const method = currentChatLog.id ? 'PUT' : 'POST';
            const url = currentChatLog.id ?
                `https://yoh-underground-server.vercel.app/api/admin/chats/${currentChatLog.id}` :
                'https://yoh-underground-server.vercel.app/api/admin/chats';

            const payload = {
                ...currentChatLog,
                // Ensure messages have correct timestamp format for backend when creating
                messages: currentChatLog.messages.map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp) // Convert ISO string back to Date object for backend processing
                }))
            };

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${currentChatLog.id ? 'update' : 'create'} chat log.`);
            }

            alert(`Chat log ${currentChatLog.id ? 'updated' : 'created'} successfully!`);
            setShowForm(false);
            setCurrentChatLog(null);
            fetchChatLogs(selectedUserIdFilter); // Re-fetch all to update list

        } catch (err: any) {
            setError(err.message || `Error ${currentChatLog.id ? 'updating' : 'creating'} chat log.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Edit/View button click
    const handleEditClick = (chatLog: ChatLog) => {
        setCurrentChatLog({
            ...chatLog,
            userIds: chatLog.userIds || [],
            messages: chatLog.messages || [],
            itineraryId: chatLog.itineraryId || '',
            subject: chatLog.subject || '',
            status: chatLog.status || 'Open' // Default status if not present
        });
        setShowForm(true);
    };

    // Handle Delete button click
    const handleDeleteClick = async (chatId: string) => {
        if (!adminToken) {
            alert('Admin token not found.');
            return;
        }
        if (!window.confirm('Are you sure you want to delete this chat log? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://yoh-underground-server.vercel.app/api/admin/chats/${chatId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete chat log.');
            }

            alert('Chat log deleted successfully!');
            fetchChatLogs(selectedUserIdFilter); // Re-fetch to update the list
        } catch (err: any) {
            setError(err.message || 'Error deleting chat log.');
        } finally {
            setLoading(false);
        }
    };


    if (loading && !chatLogs.length && !showForm) {
        return <div className="text-center py-8">Loading chat logs...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-8 bg-[#0A0A0A] rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 accent-gold">Admin: Chat Management</h1>

            <div className="mb-6 flex items-center space-x-4">
                <button
                    onClick={() => { setShowForm(true); setCurrentChatLog({ userIds: [], messages: [], itineraryId: '', subject: '', status: 'Open' }); }}
                    className="btn-primary py-2 px-4 rounded-md"
                >
                    Create New Chat Log
                </button>
                <input
                    type="text"
                    placeholder="Filter by User ID (optional)"
                    value={selectedUserIdFilter}
                    onChange={(e) => setSelectedUserIdFilter(e.target.value)}
                    className="flex-1 bg-[#1A1A1A] text-white border border-gray-700 rounded-md p-2"
                />
            </div>

            {showForm && (
                <div className="bg-[#1A1A1A] p-6 rounded-lg mb-6 shadow-xl border border-gray-700">
                    <h2 className="text-2xl font-semibold mb-4 text-white">{currentChatLog?.id ? 'Edit Chat Log' : 'Create New Chat Log'}</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">Participant User IDs (comma-separated):</label>
                            <input
                                type="text"
                                name="userIds"
                                value={currentChatLog?.userIds.join(', ') || ''}
                                onChange={handleUserIdsChange}
                                required
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">Subject (Optional):</label>
                            <input
                                type="text"
                                name="subject"
                                value={currentChatLog?.subject || ''}
                                onChange={handleFormChange}
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">Related Itinerary ID (Optional):</label>
                            <input
                                type="text"
                                name="itineraryId"
                                value={currentChatLog?.itineraryId || ''}
                                onChange={handleFormChange}
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-1">Status:</label>
                            <select
                                name="status"
                                value={currentChatLog?.status || 'Open'}
                                onChange={handleFormChange}
                                className="w-full bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                            >
                                {chatStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {/* Message History Display */}
                        <div className="border border-gray-600 p-4 rounded-md max-h-60 overflow-y-auto">
                            <h3 className="text-xl font-semibold mb-3 text-white">Message History</h3>
                            {currentChatLog?.messages.length === 0 ? (
                                <p className="text-gray-500 text-sm">No messages yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {currentChatLog?.messages.map((message, index) => (
                                        <div key={index} className="bg-gray-800 p-2 rounded-md">
                                            <p className="text-gray-300 text-sm">
                                                <span className="font-semibold">{message.senderId}:</span> {message.text}
                                            </p>
                                            <p className="text-gray-500 text-xs text-right">
                                                {new Date(message.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Add New Message Input (for existing chats) */}
                        {currentChatLog?.id && ( // Only show for existing chats
                            <form onSubmit={handleAddMessage} className="flex space-x-2 mt-4">
                                <input
                                    type="text"
                                    name="newMessageText"
                                    placeholder="Type new message..."
                                    className="flex-1 bg-[#0A0A0A] text-white border border-gray-700 rounded-md p-2"
                                />
                                <button type="submit" className="btn-primary py-2 px-4 rounded-md">
                                    Send
                                </button>
                            </form>
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
                                {isSubmitting ? 'Saving...' : 'Save Chat Log'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Chat Logs List */}
            <div className="mt-8">
                {chatLogs.length === 0 && !loading && !showForm ? (
                    <p className="text-center text-gray-400">No chat logs found. Create one to get started!</p>
                ) : (
                    <div className="space-y-4">
                        {chatLogs.map(chatLog => (
                            <div key={chatLog.id} className="border border-gray-700 rounded-md p-4 bg-[#1A1A1A] shadow-md">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-xl font-semibold text-white">Subject: {chatLog.subject || 'No Subject'}</h2>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${chatLog.status === 'Open' ? 'bg-green-600 text-white' :
                                            chatLog.status === 'Closed' ? 'bg-red-600 text-white' :
                                                'bg-gray-600 text-white'
                                        }`}>
                                        {chatLog.status}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-1">Participants: {chatLog.userIds.join(', ')}</p>
                                {chatLog.itineraryId && <p className="text-gray-400 text-sm mb-1">Itinerary ID: {chatLog.itineraryId}</p>}
                                <p className="text-gray-500 text-xs">Messages: {chatLog.messages?.length || 0}</p>
                                <p className="text-gray-500 text-xs">Last Activity: {chatLog.lastActivityAt ? new Date(chatLog.lastActivityAt).toLocaleString() : 'N/A'}</p>

                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        onClick={() => handleEditClick(chatLog)}
                                        className="btn-secondary py-1 px-3 rounded-md text-sm"
                                    >
                                        View/Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(chatLog.id)}
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

export default AdminChatManagementScreen;