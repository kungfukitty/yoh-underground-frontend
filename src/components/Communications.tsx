import React, { useState, useEffect, useRef } from 'react';

// Define the type for a single message object
interface Message {
    id: string;
    sender: 'Mr. Sterling' | 'The Principal';
    text: string;
    timestamp: string;
}

// Define props for the MessageBubble component
interface MessageBubbleProps {
    msg: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ msg }) => {
    const isSelf = msg.sender === 'Mr. Sterling';
    return (
        <div className={`flex ${isSelf ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                // UPDATE: Message bubble styles for light theme.
                className={`max-w-xs lg:max-w-md p-3 rounded-lg shadow ${isSelf ? 'bg-yellow-500 text-black' : 'bg-gray-200 text-gray-900'
                    }`}
            >
                <p className={`text-xs font-semibold mb-1 ${isSelf ? 'text-black/70' : 'text-gray-600'}`}>
                    {isSelf ? 'You' : msg.sender}
                </p>
                <p className="text-base break-words">{msg.text}</p>
                <p className={`text-right text-xs mt-1 ${isSelf ? 'text-black/60' : 'text-gray-500'}`}>{msg.timestamp}</p>
            </div>
        </div>
    );
};

const Communications: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'The Principal',
            text: 'Good morning, Mr. Sterling. Your secure channel is now active. Awaiting your first communication.',
            timestamp: '07:00 SAST',
        },
        {
            id: '2',
            sender: 'Mr. Sterling',
            text: 'Understood, Principal. Confirming receipt. My current objective remains the SAST market analysis.',
            timestamp: '07:05 SAST',
        },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    id: String(prevMessages.length + 1),
                    sender: 'Mr. Sterling',
                    text: newMessage,
                    timestamp: timeString,
                },
            ]);
            setNewMessage('');
        }
    };

    return (
        // UPDATE: Switched to a light theme background and responsive padding.
        <div className="bg-gray-50 min-h-screen p-4 md:p-8">
            {/* UPDATE: Adjusted title for light theme and responsive font size. */}
            <h1 className="text-3xl md:text-4xl font-serif text-yellow-600 mb-8">Secure Communications</h1>
            <p className="text-lg text-gray-500 mb-8">Encrypted channel for high-level correspondence.</p>

            {/* UPDATE: Card container for light theme. */}
            <div className="bg-white p-6 rounded-lg shadow-md h-[60vh] flex flex-col">
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto pr-4 mb-4">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} msg={msg} />
                    ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-4">
                    {/* UPDATE: Input styles for light theme. */}
                    <input
                        type="text"
                        className="flex-1 bg-gray-100 border border-gray-300 rounded-md p-3 focus:border-yellow-500 focus:ring-yellow-500 text-gray-900"
                        placeholder="Type your secure message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    {/* UPDATE: Button styles for light theme. */}
                    <button type="submit" className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-md hover:bg-yellow-600 transition-colors">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Communications;