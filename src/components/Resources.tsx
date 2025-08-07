import React, { useState } from 'react';

interface ResourceDocument {
    id: string;
    title: string;
    description: string;
    category: string;
    fileUrl: string;
}

const Resources: React.FC = () => {
    const [message, setMessage] = useState('');
    const confidentialResources: ResourceDocument[] = [
        { id: 'doc1', title: 'South Africa Strategic Briefing - Q3 2025', description: 'In-depth analysis of regional opportunities and risk assessments.', category: 'Intelligence', fileUrl: '#' },
        { id: 'doc2', title: 'Local Network Directory - V.2.1', description: 'Curated contact list for vetted local specialists.', category: 'Network', fileUrl: '#' },
        { id: 'doc3', title: 'Operational Protocol - Johannesburg', description: 'Guidelines for discreet movement and engagement.', category: 'Protocol', fileUrl: '#' },
    ];
    const handleViewDocument = (title: string) => setMessage(`Accessing secure document: "${title}"...`);

    return (
        // UPDATE: Switched to a light theme background and responsive padding.
        <div className="bg-gray-50 min-h-screen p-4 md:p-8">
            {/* UPDATE: Adjusted title for light theme and responsive font size. */}
            <h1 className="text-3xl md:text-4xl font-serif text-yellow-600 mb-8">Resource Vault</h1>
            <p className="text-lg text-gray-500 mb-8">Access to confidential intelligence and operational documents.</p>
            {message && <p className="mb-4 text-green-600">{message}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {confidentialResources.map(resource => (
                    // UPDATE: Card styles for light theme.
                    <div key={resource.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-yellow-700 mb-2">{resource.title}</h3>
                            <p className="text-gray-500 text-sm mb-3">Category: {resource.category}</p>
                            <p className="text-gray-800 mb-4">{resource.description}</p>
                        </div>
                        {/* UPDATE: Button styles for light theme. */}
                        <button
                            onClick={() => handleViewDocument(resource.title)}
                            className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-md text-sm self-start hover:bg-yellow-600 transition-colors"
                        >
                            VIEW
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Resources;