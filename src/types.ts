// File: src/types.ts - UPDATED (Add 'content' to Resource Interface)

// Define the shape of the user data object, including properties from backend and frontend needs
export interface UserData {
    id: string;
    name: string;
    email: string;
    status: string;
    isAdmin?: boolean;
    isClaimed?: boolean; // From backend's claim process
    accessCode?: string; // From backend's claim process (though should be deleted after claim)
    isNDAAccepted?: boolean; // For NDA Management
    ndaAcceptedAt?: string; // For NDA Management timestamp (ISO string from frontend)

    // For Discreet Connection Facilitator
    connectionInterests?: string[]; // Array of strings (e.g., "Finance", "Tech", "Travel")
    connectionVisibility?: 'Visible to all members' | 'Visible to members with shared interests' | 'Not visible for connections';
    lastConnectionUpdateAt?: string; // ISO string timestamp
}

// Define the shape of the user object coming directly from the API login response
export interface ApiUser {
    id: string;
    name: string;
    email: string;
    isAdmin?: boolean;
    isNDAAccepted?: boolean;
    // For Discreet Connection Facilitator (ensure backend returns these on login)
    connectionInterests?: string[];
    connectionVisibility?: 'Visible to all members' | 'Visible to members with shared interests' | 'Not visible for connections';
    lastConnectionUpdateAt?: string;
}

// Existing Event Interface
export interface Event {
    id: string;
    name: string;
    description: string;
    date: string; // ISO string from backend
    location: string;
    organizer?: string;
    maxCapacity?: number;
    attendees: string[];
    status?: 'Upcoming' | 'Full' | 'Cancelled';
    isExclusive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Existing Itinerary Interfaces
export interface ItineraryActivity {
    date: string; // ISO string for the activity date/time
    description: string;
    location: string;
    notes?: string; // Optional notes for the activity
}

export interface Itinerary {
    id: string; // Document ID in Firestore
    userId: string; // ID of the member this itinerary belongs to
    name: string; // Name of the itinerary (e.g., "Johannesburg Luxury Tour")
    description?: string; // Overall description
    startDate: string; // ISO string
    endDate: string; // ISO string
    status: 'Draft' | 'Planned' | 'Active' | 'Completed' | 'Cancelled';
    details: ItineraryActivity[]; // Array of detailed activities
    createdAt?: string; // ISO string
    updatedAt?: string; // ISO string
    createdBy?: string; // User ID of the admin who created it
}

// Existing Chat Interfaces
export interface ChatMessage {
    senderId: string; // User ID of sender (admin or member)
    text: string;
    timestamp: string; // ISO string
}

export interface ChatLog {
    id: string; // Document ID in Firestore
    userIds: string[]; // Array of participant user IDs (e.g., [adminId, memberId])
    messages: ChatMessage[]; // Array of messages
    itineraryId?: string; // Optional: Link to an itinerary if applicable
    subject?: string; // Optional: Short description of the chat/request
    status: 'Open' | 'Closed' | 'Archived'; // Status of the chat conversation
    createdAt?: string; // ISO string
    lastActivityAt?: string; // ISO string
    createdBy?: string; // Admin User ID who created/initiated the chat
}

// Existing Network Interface
export interface Network {
    id: string; // Document ID in Firestore
    name: string; // Name of the network/group (e.g., "Global Finance Alliance")
    description?: string; // Purpose or focus of the network
    type: 'Professional' | 'Social' | 'Interest-Based'; // Type of network
    members: string[]; // Array of user IDs who belong to this network
    visibility: 'Public' | 'Private'; // Visibility within members
    createdAt?: string; // ISO string
    updatedAt?: string; // ISO string
    createdBy?: string; // User ID of the admin who created it
}


// NEW: Interface for a Resource object - Added 'content' field
export interface Resource {
    id: string; // Document ID in Firestore
    title: string; // Name of the resource
    description?: string; // Short description of the resource
    type: 'Document' | 'Link' | 'Download' | 'Contact Info' | 'Content Template'; // Added 'Content Template' type
    url?: string; // URL for external links or Firebase Storage path for downloads
    content?: string; // NEW: Field to store the text content of emails/scripts/pitches
    accessLevel: 'All Members' | 'Specific Networks' | 'Admin Only'; // Granular access control
    networkIds?: string[]; // Optional: Array of network IDs if accessLevel is 'Specific Networks'
    createdAt?: string; // ISO string
    updatedAt?: string; // ISO string
    createdBy?: string; // User ID of the admin who created it
}