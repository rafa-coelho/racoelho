import * as gtag from '../../lib/gtag';
import Image from 'next/image';

const HighlightLinkList = ({ links }) => {
    const shouldScroll = links.length > 1;
    return (
        <div className="w-full transition-all duration-500 ease-in-out relative">
            {/* {shouldScroll && (
                <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-900 pointer-events-none"></div>
            )} */}

            <div className={`flex ${shouldScroll ? 'space-x-4 overflow-x-auto pr-4' : ''} justify-center custom-scrollbar gap-2`}>
                {links.map((link, index) => (
                    <HighlightLink key={index} link={link} />
                ))}
            </div>

            <style>
                {`
                    .custom-scrollbar::-webkit-scrollbar {
                        height: 8px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background-color: #4A5568; /* Gray-700 */
                        border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background-color: #2D3748; /* Gray-800 */
                    }
                `}
            </style>
        </div>
    );
};

const HighlightLink = ({ link } = props) => {
    const handleLinkClick = (url, title) => {
        gtag.event({
            action: 'click',
            category: 'HIGHLIGHT_LINK',
            label: title,
            value: url,
        });
    };

    return (
        <a
            href={link.url}
            target="_blank"
            className="text-lg font-bold text-white hover:none"
            rel="noreferrer"
            onClick={() => handleLinkClick(link.url, link.title)}
        >
            <div className="bg-gray-800 p-3 rounded-lg shadow-md w-36 flex-shrink-0">
                <div className="w-full justify-center align-center flex">
                    <Image
                        src={link.image}
                        alt={link.title}
                        className="w-14 h-14 rounded-full object-cover"
                        width={10}
                        height={10}
                    />
                </div>
                <div className="mt-2 text-center">
                    {link.title}
                    <p className="text-gray-400 mt-1 font-light text-sm">
                        {link.description}
                    </p>
                </div>
            </div>
        </a>
    );
};

export default HighlightLinkList;
