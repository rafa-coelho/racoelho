import React from 'react';

const levelColors = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-orange-500',
    advanced: 'bg-red-500',
    default: 'bg-gray-500'
};

const LevelBadge = ({ level }) => {
    const colorClass = levelColors[level.toLowerCase()] || levelColors.default;

    const levelLabel = {
        easy: 'Fácil',
        medium: 'Médio',
        hard: 'Difícil',
        advanced: 'Avançado',
    };

    return (
        <div className={`inline-block text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded ${colorClass}`}>
            {levelLabel[level.toLowerCase()].trim()}
        </div>
    );
};

export default LevelBadge;
