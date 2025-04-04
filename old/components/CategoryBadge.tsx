import React from 'react';

const categoryColors = {
    backend: 'bg-blue-500 text-white',
    frontend: 'bg-green-500 text-white',
    api: 'bg-yellow-500 text-white',
    'ci/cd': 'bg-red-500 text-white',
    automação: 'bg-purple-500 text-white',
    devops: 'bg-indigo-500 text-white',
    mobile: 'bg-pink-500 text-white',
    design: 'bg-teal-500 text-white',
    default: 'bg-gray-500 text-white'
};

const CategoryBadge = ({ category }) => {
    const colorClass = categoryColors[category.trim().toLowerCase()] || categoryColors.default;

    return (
        <span className={`inline-block text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded ${colorClass}`}>
            {category.trim()}
        </span>
    );
};

export default CategoryBadge;
