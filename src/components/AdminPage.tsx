import React, { useState, useEffect } from 'react';
import { UserData } from '../types'; // Import the shared type

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for the new user form
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [formMessage, setFormMessage] = useState<string | null>(null);

    const API_URL = 'https://yoh-underground-server.vercel.app/api/admin';

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('yoh_token');
            if (!token) throw new Error('Authentication token not found.');

            const response = await fetch(`${API_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // UPDATE: Robust error handling to prevent JSON parsing errors.
            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch users.');
                } else {
                    const errorText = await response.text();
                    console.error("Server returned non-JSON response:", errorText);
                    throw new Error('Server returned an unexpected response. Check console for details.');
                }
            }

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormMessage('Creating user...');
        try {
            const token = localStorage.getItem('yoh_token');
            if (!token) throw new Error('Authentication token not found.');

            const response = await fetch(`${API_URL}/create-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newUserName, email: newUserEmail })
            });

            // UPDATE: Robust error handling for the create user endpoint.
            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to create user.');
                } else {
                    const errorText = await response.text();
                    console.error("Server returned non-JSON response:", errorText);
                    throw new Error('Server returned an unexpected response when creating user.');
                }
            }

            const data = await response.json();
            setFormMessage(`User created! Access Code: ${data.accessCode}`);
            setNewUserName('');
            setNewUserEmail('');
            // Automatically refresh the user list after creation
            setTimeout(() => {
                fetchUsers();
                setFormMessage('');
            }, 3000);
        } catch (err) {
            setFormMessage(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading Admin Data...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-8">
            <h1 className="text-3xl md:text-4xl font-serif text-yellow-600 mb-10">Admin Console</h1>

            <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Create New User</h2>
                <form onSubmit={handleCreateUser} className="flex flex-col md:flex-row gap-4 items-start">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        className="w-full md:w-1/3 p-3 bg-gray-100 text-gray-900 rounded-md border border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 focus:outline-none"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="w-full md:w-1/3 p-3 bg-gray-100 text-gray-900 rounded-md border border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 focus:outline-none"
                        required
                    />
                    <button type="submit" className="w-full md:w-auto bg-yellow-500 text-black font-bold py-3 px-6 rounded-md hover:bg-yellow-600 transition-colors">
                        Create User
                    </button>
                </form>
                {formMessage && <p className="mt-4 text-green-600">{formMessage}</p>}
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Manage Users</h2>
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left p-4 font-semibold text-gray-600">Name</th>
                                <th className="text-left p-4 font-semibold text-gray-600">Email</th>
                                <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                                <th className="text-left p-4 font-semibold text-gray-600">Access Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-4 text-gray-900">{user.name} {user.isAdmin && <span className="text-xs text-yellow-700 font-semibold ml-2">(Admin)</span>}</td>
                                    <td className="p-4 text-gray-900">{user.email}</td>
                                    <td className="p-4">{user.isClaimed ? <span className="text-green-600">Active</span> : <span className="text-yellow-600">Pending Activation</span>}</td>
                                    <td className="p-4 font-mono text-gray-500">{user.isClaimed ? 'N/A' : user.accessCode}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default AdminPage;