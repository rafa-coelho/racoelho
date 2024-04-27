
const FloatActionBar = () => {

    const actions = [
        {
            label: "Like",
            color: "red",
            enabled: true,
            svg: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        },
        {
            label: "Comment",
            color: "yellow",
            enabled: false,
            svg: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
        },
        {
            label: "Share",
            color: "blue",
            enabled: true,
            svg: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 16c-.83 0-1.58.34-2.12.88L8.91 13c.05-.21.09-.43.09-.65s-.04-.44-.09-.65l7.97-3.83c.54.54 1.29.88 2.12.88 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .22.04.43.09.65L9.12 10.2C8.58 9.66 7.83 9.32 7 9.32c-1.66 0-3 1.34-3 3s1.34 3 3 3c.83 0 1.58-.34 2.12-.88l7.97 3.83c-.05.21-.09.43-.09.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z" />
            </svg>
        },
        {
            label: "Save",
            color: "orange",
            enabled: true,
            svg: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
            </svg>
        }
    ];

    return (
        <>
            <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white p-2 rounded-full shadow-lg flex items-center space-x-3 p-3 opacity-70">
                {
                    actions
                    .filter(x => x.enabled)
                    .map((action, index) => {
                        return (
                            <button 
                                key={index} 
                                className={`focus:outline-none hover:text-${action.color}-500 transition duration-150 hover:scale-125`} 
                                aria-label={action.label}
                            >
                                {action.svg}
                            </button>
                        )
                    })
                }

            </div>
        </>
    );
};


export default FloatActionBar;
