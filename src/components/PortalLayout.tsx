// File: src/components/PortalLayout.tsx - FINAL CORRECTED (Admin Section Routing)

import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import Itinerary from './Itinerary';
import Communications from './Communications';
import Network from './Network';
import Resources from './Resources'; // Member-facing Resources (future)
import Sidebar from './Sidebar';
import AdminPage from './AdminPage'; // This component might be removed or used as a wrapper later
import NDAAcceptanceScreen from './NDAAcceptanceScreen';
import ProfileScreen from './ProfileScreen';
import EventCalendarScreen from './EventCalendarScreen';
import ConnectionPreferencesScreen from './ConnectionPreferencesScreen';
import DiscoverMembersScreen from './DiscoverMembersScreen';
import AdminItineraryManagementScreen from './AdminItineraryManagementScreen';
import AdminChatManagementScreen from './AdminChatManagementScreen';
import AdminNetworkManagementScreen from './AdminNetworkManagementScreen';
import AdminResourceManagementScreen from './AdminResourceManagementScreen';
import { UserData } from '../types';

interface PortalLayoutProps {
    user: UserData | null;
    onLogout: () => void;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ user, onLogout }) => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [ndaAcceptedLocal, setNdaAcceptedLocal] = useState(user?.isNDAAccepted || false);
    const [isLoadingNdaStatus, setIsLoadingNdaStatus] = useState(true);
    const userToken = localStorage.getItem('yoh_token');

    useEffect(() => {
        const fetchNdaStatus = async () => {
            if (!userToken || !user?.id) {
                console.error("User or token not found for NDA status check.");
                setIsLoadingNdaStatus(false);
                return;
            }

            try {
                const response = await fetch('https://yoh-underground-server.vercel.app/api/member/nda-status', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.isNDAAccepted) {
                        setNdaAcceptedLocal(true);
                        const storedUser = JSON.parse(localStorage.getItem('yoh_user') || '{}');
                        if (!storedUser.isNDAAccepted) {
                            localStorage.setItem('yoh_user', JSON.stringify({ ...storedUser, isNDAAccepted: true }));
                        }
                    } else {
                        setNdaAcceptedLocal(false);
                    }
                } else {
                    console.error('Failed to fetch NDA status:', response.status, response.statusText);
                    setNdaAcceptedLocal(false);
                }
            } catch (error) {
                console.error('Network error fetching NDA status:', error);
                setNdaAcceptedLocal(false);
            } finally {
                setIsLoadingNdaStatus(false);
            }
        };

        if (!ndaAcceptedLocal || isLoadingNdaStatus) {
            fetchNdaStatus();
        }
    }, [user, userToken, ndaAcceptedLocal, isLoadingNdaStatus]);

    if (!user || isLoadingNdaStatus) {
        return (
            <div className="h-screen bg-gray-900 flex items-center justify-center text-white">
                <p>Loading portal... Checking NDA status...</p>
            </div>
        );
    }

    if (!ndaAcceptedLocal) {
        return (
            <NDAAcceptanceScreen
                onNdaAccepted={() => {
                    setNdaAcceptedLocal(true);
                    const storedUser = JSON.parse(localStorage.getItem('yoh_user') || '{}');
                    localStorage.setItem('yoh_user', JSON.stringify({ ...storedUser, isNDAAccepted: true }));
                }}
                userToken={userToken || ''}
            />
        );
    }

    // Render the appropriate section based on activeSection state
    const renderSection = () => {
        switch (activeSection) {
            case 'dashboard': return <Dashboard />;
            case 'profile': return <ProfileScreen />;
            case 'events': return <EventCalendarScreen />;
            case 'connections': return <ConnectionPreferencesScreen />;
            case 'discover-members': return <DiscoverMembersScreen />;
            case 'itinerary': return <Itinerary />;
            case 'communications': return <Communications />;
            case 'network': return <Network />;
            case 'resources': return <Resources />;
            case 'admin': return <p className="text-center text-gray-400 p-8">Select an Admin Tool from the sidebar.</p>; // NEW: Placeholder for main 'admin' click
            case 'admin-itineraries': return <AdminItineraryManagementScreen />; // Explicitly render
            case 'admin-chats': return <AdminChatManagementScreen />; // Explicitly render
            case 'admin-networks': return <AdminNetworkManagementScreen />; // Explicitly render
            case 'admin-resources': return <AdminResourceManagementScreen />; // Explicitly render
            default:
                // Fallback for any unhandled activeSection
                return <Dashboard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <Sidebar
                user={user}
                onLogout={onLogout}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />
            <main className="flex-1 overflow-y-auto p-8">
                {renderSection()}
            </main>
        </div>
    );
};

export default PortalLayout;