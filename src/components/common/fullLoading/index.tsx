import React from 'react';

interface FullLoadingProps {
    isLoading: boolean;
}

const FullLoading: React.FC<FullLoadingProps> = ({ isLoading }: FullLoadingProps) => {
    return (
        isLoading ? <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75" style={{ zIndex: '999' }}>
            <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
        </div>
        : ''
    );
};

export default FullLoading;
