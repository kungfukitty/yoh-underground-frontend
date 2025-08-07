import React from 'react';

interface NetworkMember {
    id: string;
    name: string;
    title: string;
    focus: string;
    status: string;
}

interface NetworkCardProps {
    member: NetworkMember;
}

const NetworkCard: React.FC<NetworkCardProps> = ({ member }) => (
    // UPDATE: Card styles for light theme.
    <div className="bg-white p-6 rounded-lg shadow-md">
        {/* UPDATE: Text styles for light theme. */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
        <p className="text-gray-500 text-sm mb-3">{member.title}</p>
        <p className="text-gray-800 mb-2">Focus: {member.focus}</p>
        <p className={`text-sm font-medium ${member.status === 'In-Country' ? 'text-green-600' : 'text-yellow-600'}`}>
            {`Status: ${member.status}`}
        </p>
    </div>
);

const Network: React.FC = () => {
    const networkMembers: NetworkMember[] = [
        { id: '1', name: 'Mr. Dubois', title: 'Financial Strategist, Geneva', focus: 'Global Asset Management', status: 'In-Country' },
        { id: '2', name: 'Mr. Chen', title: 'Tech Innovator, Singapore', focus: 'AI & Data Security', status: 'Connecting Soon' },
        { id: '3', name: 'Mr. Garcia', title: 'Resource Executive, Dubai', focus: 'Mineral Logistics', status: 'In-Country' },
    ];
    return (
        // UPDATE: Switched to a light theme background and responsive padding.
        <div className="bg-gray-50 min-h-screen p-4 md:p-8">
            {/* UPDATE: Adjusted title for light theme and responsive font size. */}
            <h1 className="text-3xl md:text-4xl font-serif text-yellow-600 mb-8">Network</h1>
            <p className="text-lg text-gray-500 mb-8">Discreet profiles of vetted peers within your sphere of operation.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {networkMembers.map(member => <NetworkCard key={member.id} member={member} />)}
            </div>
        </div>
    );
};
export default Network;