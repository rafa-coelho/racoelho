import React from 'react';

const Empty = ({ message }) => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center h-full w-full py-20">
            <p className="text-gray-400 text-lg text-center">{message}</p>
        </div>
    );
};

export default Empty;
