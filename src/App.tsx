// File: App.tsx - UPDATED

import { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import PortalLayout from './components/PortalLayout';
import ClaimCodeScreen from './components/ClaimCodeScreen';
import './index.css';

// Import UserData and ApiUser from the shared types file
import { UserData, ApiUser } from './types'; // <-- UPDATED IMPORT

// REMOVED: Firebase Client SDK imports as per clarification that client-side Firebase Auth is NOT used.
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";


// Define the possible views for the authentication flow
type AuthView = 'login' | 'claim';

// --- REMOVED Firebase Client SDK Configuration and Initialization ---
/*
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
const app = initializeApp(firebaseConfig);
*/
// --- END REMOVED Firebase Client SDK Initialization ---


function App() {
    const [user, setUser] = useState<UserData | null>(null);
    const [authView, setAuthView] = useState<AuthView>('login');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // When the app loads, check if a token exists in localStorage
        const token = localStorage.getItem('yoh_token');
        const userDataString = localStorage.getItem('yoh_user');

        if (token && userDataString) {
            const userData = JSON.parse(userDataString);
            setUser({
                ...userData,
                status: userData.status || 'active',
                isAdmin: userData.isAdmin || false,
                isNDAAccepted: userData.isNDAAccepted || false // Ensure this is loaded from localStorage
            });
            setAuthView('login');
        }
        setIsLoading(false);
    }, []);

    // Handles successful login from AuthScreen
    const handleLoginSuccess = (loggedInUser: ApiUser, token: string) => {
        // Construct the full user data object, ensuring isAdmin and isNDAAccepted are included
        const fullUser: UserData = {
            id: loggedInUser.id,
            name: loggedInUser.name,
            email: loggedInUser.email,
            status: 'active', // Assuming 'active' upon successful login
            isAdmin: loggedInUser.isAdmin || false, // Default to false if not provided by API
            isNDAAccepted: loggedInUser.isNDAAccepted || false // IMPORTANT: Assume false initially or get from backend if available
        };
        localStorage.setItem('yoh_token', token);
        localStorage.setItem('yoh_user', JSON.stringify(fullUser));
        setUser(fullUser);
    };

    const handleLogout = () => {
        localStorage.removeItem('yoh_token');
        localStorage.removeItem('yoh_user');
        setUser(null);
    };

    // Renders the correct authentication screen based on the authView state
    const renderAuthFlow = () => {
        switch (authView) {
            case 'claim':
                return (
                    <ClaimCodeScreen
                        onClaimSuccess={() => setAuthView('login')}
                        onNavigateToLogin={() => setAuthView('login')}
                    />
                );
            case 'login':
            default:
                return (
                    <AuthScreen
                        onLoginSuccess={handleLoginSuccess}
                        onNavigateToClaim={() => setAuthView('claim')}
                    />
                );
        }
    };

    if (isLoading) {
        return <div className="h-screen bg-gray-900 flex items-center justify-center text-white">Loading Session...</div>;
    }

    return (
        <div className="App">
            {user ? (
                <PortalLayout user={user} onLogout={handleLogout} />
            ) : (
                renderAuthFlow()
            )}
        </div>
    );
}

export default App;