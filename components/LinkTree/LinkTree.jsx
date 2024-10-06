import * as gtag from '../../lib/gtag';
import Image from 'next/image';
import { RightArrowIcon } from '../Icons';

const LinkTree = ({ children }) => {
    return (
        <ul className="space-y-4">
            {children}
        </ul>
    );
};

LinkTree.displayName = 'LinkTree';


LinkTree.LinkTreeItem = ({ link }) => {
    const handleLinkClick = (url, title) => {
        gtag.event({
            action: 'link_click',
            category: 'LinkTree',
            label: title,
            value: url,
        });
    };
    return (
        <li>
            <a
                href={link.url}
                className="flex items-center bg-gray-800 text-white py-4 px-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
                rel="noreferrer"
                onClick={() => handleLinkClick(link.url, link.title)}
            >
                <div className="flex-shrink-0 mr-4">
                    {
                        link.image?.includes('http') ? (
                            <Image
                                src={link.image}
                                alt={link.title}
                                className="w-6 h-6 object-cover rounded-full"
                                width={10}
                                height={10}
                            />
                        ) : null
                    }
                </div>
                <span className="flex-grow text-center flex items-center justify-center">{link.title}</span>
                <span className="ml-4 flex items-center">
                    <RightArrowIcon color="#FFF" />
                </span>
            </a>
        </li>
    );
};

LinkTree.LinkTreeItem.displayName = 'LinkTreeItem';

export default LinkTree;
