// src/components/member/Dashboard.tsx
import React, { useEffect, useState } from 'react';

const Dashboard: React.FC = () => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Africa/Johannesburg',
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold">Dashboard</h2>

            <section className="bg-white shadow rounded p-4">
                <h3 className="text-lg font-medium mb-2">Current Status</h3>
                <p>Date: {dateTime.toLocaleDateString('en-US', dateOptions)}</p>
                <p>Time: {`${dateTime.toLocaleTimeString('en-US', timeOptions)} SAST`}</p>
                <p>Status: Operational</p>
            </section>

            <section className="bg-white shadow rounded p-4">
                <h3 className="text-lg font-medium mb-2">Priority Communication</h3>
                <p><strong>From:</strong> The Principal</p>
                <p>"Your next briefing is scheduled for 18:00 SAST. Discretion is paramount."</p>
            </section>

            <section className="bg-white shadow rounded p-4">
                <h3 className="text-lg font-medium mb-2">Quick Access</h3>
                <ul className="space-y-2">
                    <li><a href="/itinerary" className="text-blue-600 hover:underline">View Itinerary →</a></li>
                    <li><a href="/comms" className="text-blue-600 hover:underline">Secure Comms ✉</a></li>
                    <li><a href="/network" className="text-blue-600 hover:underline">Network Brief ♟</a></li>
                </ul>
            </section>
        </div>
    );
};

export default Dashboard;
