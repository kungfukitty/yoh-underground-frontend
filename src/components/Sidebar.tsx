// File: src/components/Sidebar.tsx - UPDATED (Add Admin Resources Link)

import React from 'react';
import { UserData } from '../types';

interface SidebarLinkProps {
    sectionName: string;
    activeSection: string;
    setActiveSection: (section: string) => void;
    children: React.ReactNode;
    icon: string;
}

interface SidebarProps {
    user: UserData | null;
    onLogout: () => void;
    activeSection: string;
    setActiveSection: (section: string) => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ sectionName, activeSection, setActiveSection, children, icon }) => {
    const isActive = activeSection === sectionName;
    const baseClasses = "flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200";
    const activeClasses = "bg-accent-gold text-black font-semibold shadow-lg";
    const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

    return (
        <div onClick={() => setActiveSection(sectionName)} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            <span className="w-6 text-center text-lg font-bold">{icon}</span>
            <span className="ml-4">{children}</span>
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, activeSection, setActiveSection }) => {
    return (
        <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col shadow-2xl">
            <div className="mb-10 p-2">
                <h1 className="text-3xl font-serif text-accent-gold">YOH</h1>
                <p className="text-sm text-gray-500">Operator Console</p>
            </div>

            <nav className="flex-grow">
                <SidebarLink sectionName="dashboard" activeSection={activeSection} setActiveSection={setActiveSection} icon="D">The Hub</SidebarLink> {/* Renamed */}
                <SidebarLink sectionName="profile" activeSection={activeSection} setActiveSection={setActiveSection} icon="P">My Dossier</SidebarLink> {/* Renamed */}
                <SidebarLink sectionName="events" activeSection={activeSection} setActiveSection={setActiveSection} icon="E">Curated Engagements</SidebarLink> {/* Renamed */}
                <SidebarLink sectionName="connections" activeSection={activeSection} setActiveSection={setActiveSection} icon="C">Connection Preferences</SidebarLink> {/* Renamed for clarity */}
                <SidebarLink sectionName="discover-members" activeSection={activeSection} setActiveSection={setActiveSection} icon="F">Peer Discovery</SidebarLink> {/* Renamed */}
                <SidebarLink sectionName="itinerary" activeSection={activeSection} setActiveSection={setActiveSection} icon="J">My Journey</SidebarLink> {/* Renamed, changed icon to J for Journey */}
                <SidebarLink sectionName="communications" activeSection={activeSection} setActiveSection={setActiveSection} icon="L">Direct Line</SidebarLink> {/* Renamed, changed icon to L for Line */}
                <SidebarLink sectionName="network" activeSection={activeSection} setActiveSection={setActiveSection} icon="A">Strategic Alliances</SidebarLink> {/* Renamed, changed icon to A for Alliances */}
                <SidebarLink sectionName="resources" activeSection={activeSection} setActiveSection={setActiveSection} icon="V">The Vault</SidebarLink> {/* Renamed, changed icon to V for Vault */}

                {/* Conditional rendering for Admin Console link and sub-links */}
                {user?.isAdmin && (
                    <>
                        <hr className="border-gray-700 my-4" />
                        <h3 className="text-sm font-semibold text-gray-400 mb-2 px-3">Operator Tools</h3> {/* Renamed Admin Tools */}
                        <SidebarLink sectionName="admin" activeSection={activeSection} setActiveSection={setActiveSection} icon="O">Operator's Deck</SidebarLink> {/* Renamed Admin Console */}
                        <SidebarLink sectionName="admin-itineraries" activeSection={activeSection} setActiveSection={setActiveSection} icon="i">Journey Management</SidebarLink>
                        <SidebarLink sectionName="admin-chats" activeSection={activeSection} setActiveSection={setActiveSection} icon="c">Comms Log</SidebarLink>
                        <SidebarLink sectionName="admin-networks" activeSection={activeSection} setActiveSection={setActiveSection} icon="n">Alliance Registry</SidebarLink>
                        <SidebarLink sectionName="admin-resources" activeSection={activeSection} setActiveSection={setActiveSection} icon="v">Vault Management</SidebarLink> {/* NEW: Admin Resources link */}
                    </>
                )}
            </nav>

            <div className="p-2">
                <hr className="border-gray-700 my-4" />
                {user && (
                    <div className="mb-4">
                        <p className="font-semibold text-gray-200">{user.name}</p>
                        <p className="text-sm text-green-400">{user.status}</p>
                    </div>
                )}
                <button
                    onClick={onLogout}
                    className="w-full bg-red-600/80 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors"
                >
                    Log Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;