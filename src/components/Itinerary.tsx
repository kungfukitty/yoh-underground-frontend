import React from 'react';

interface ItineraryItemProps {
    item: {
        id: string;
        time: string;
        title: string;
        location: string;
        description: string;
    };
}

const ItineraryItem: React.FC<ItineraryItemProps> = ({ item }) => (
    // UPDATE: Card styles for light theme.
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        {/* UPDATE: Text styles for light theme. */}
        <h3 className="text-xl font-semibold text-yellow-700 mb-2">{item.time} - {item.title}</h3>
        <p className="text-gray-600 mb-2">Location: {item.location}</p>
        <p className="text-gray-800">{item.description}</p>
    </div>
);

const Itinerary: React.FC = () => {
    const itineraryData = [
        { id: '1', time: '09:00 SAST', title: 'Private Briefing with "The Architect"', location: 'Villa Sanctum - Private Study', description: 'Strategic overview of local investment opportunities. Expect secure, high-level discussions.' },
        { id: '2', time: '12:30 SAST', title: 'Curated Culinary Experience', location: 'Mandela Square - Exclusive Rooftop', description: 'Lunch with a prominent local figure. Focus on discreet networking.' },
        { id: '3', time: '18:00 SAST', title: 'Discreet Social Engagement', location: 'Undisclosed Location, Sandton', description: 'An evening gathering with vetted peers. Dress code: Executive Casual.' },
    ];
    return (
        // UPDATE: Switched to a light theme background and responsive padding.
        <div className="bg-gray-50 min-h-screen p-4 md:p-8">
            {/* UPDATE: Adjusted title for light theme and responsive font size. */}
            <h1 className="text-3xl md:text-4xl font-serif text-yellow-600 mb-8">Itinerary</h1>
            <p className="text-lg text-gray-500 mb-8">Your meticulously curated schedule.</p>
            <div>{itineraryData.map(item => <ItineraryItem key={item.id} item={item} />)}</div>
        </div>
    );
};

export default Itinerary;