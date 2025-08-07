// File: src/components/EventCalendarScreen.tsx - UPDATED (Simplified date parsing)

import React, { useState, useEffect } from 'react';
import { Event } from '../types';

interface EventCalendarScreenProps {
    // No props needed for now, component fetches its own data
}

const EventCalendarScreen: React.FC<EventCalendarScreenProps> = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userToken = localStorage.getItem('yoh_token');
    const userId = JSON.parse(localStorage.getItem('yoh_user') || '{}').id;

    const fetchEvents = async () => {
        if (!userToken) {
            setError('Authentication token not found. Please log in.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://yoh-underground-server.vercel.app/api/events', {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch events.');
            }

            const data = await response.json();
            // --- FIX START: No need for complex toDate() logic, date is now always ISO string from backend ---
            setEvents(data.events);
            // --- FIX END ---
        } catch (err: any) {
            setError(err.message || 'Error fetching events.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [userToken]);

    const handleRsvp = async (eventId: string, isAttending: boolean) => {
        if (!userToken) {
            alert('You must be logged in to RSVP.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const method = isAttending ? 'DELETE' : 'POST';
            const response = await fetch(`https://yoh-underground-server.vercel.app/api/events/${eventId}/rsvp`, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update RSVP.');
            }

            await fetchEvents();
            alert(`RSVP ${isAttending ? 'canceled' : 'successful'}!`);
        } catch (err: any) {
            setError(err.message || 'Error updating RSVP.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading events...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    if (events.length === 0) {
        return <div className="text-center py-8 text-gray-400">No upcoming events found.</div>;
    }

    return (
        <div className="p-8 bg-[#0A0A0A] rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 accent-gold">Curated Events</h1>
            <div className="space-y-6">
                {events.map(event => (
                    <div key={event.id} className="border border-gray-700 rounded-md p-4">
                        <h2 className="text-xl font-semibold text-white mb-2">{event.name}</h2>
                        <p className="text-gray-400 text-sm mb-1">
                            <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleString()}
                        </p>
                        <p className="text-gray-400 text-sm mb-2">
                            <span className="font-semibold">Location:</span> {event.location}
                        </p>
                        <p className="text-gray-300 mb-3">{event.description}</p>
                        <p className="text-gray-500 text-xs">
                            {event.attendees && event.attendees.length > 0 && `Attendees: ${event.attendees.length}`}
                            {event.maxCapacity && ` / ${event.maxCapacity}`}
                        </p>

                        {userId && event.attendees.includes(userId) ? (
                            <button
                                onClick={() => handleRsvp(event.id, true)}
                                className="mt-4 bg-red-600/80 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors"
                                disabled={loading}
                            >
                                Cancel RSVP
                            </button>
                        ) : (
                            <button
                                onClick={() => handleRsvp(event.id, false)}
                                className={`mt-4 btn-primary py-2 px-4 rounded-md text-sm ${event.status === 'Full' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading || event.status === 'Full'}
                            >
                                {event.status === 'Full' ? 'Full' : 'RSVP'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventCalendarScreen;