import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ className = "" }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className={`flex items-center text-gray-600 hover:text-primary transition font-medium mb-4 ${className}`}
        >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
        </button>
    );
};

export default BackButton;
