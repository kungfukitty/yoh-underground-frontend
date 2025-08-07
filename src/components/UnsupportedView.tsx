// src/components/common/UnsupportedView.tsx
import React from 'react';

const UnsupportedView: React.FC = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center p-6">
        <div className="max-w-md">
            <h1 className="text-2xl font-bold mb-4">Portal Access</h1>
            <p className="text-gray-700">
                For security and optimal experience, the YOH Underground portal is designed for desktop or tablet access.
            </p>
        </div>
    </div>
);

export default UnsupportedView;
