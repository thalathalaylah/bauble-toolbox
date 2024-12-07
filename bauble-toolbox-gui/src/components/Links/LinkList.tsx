import React from 'react';
import { Link } from '../../types';
import { open } from '@tauri-apps/plugin-shell';

interface LinkListProps {
    links: Link[];
    isLoading?: boolean;
    error?: string | null;
}

const LinkList: React.FC<LinkListProps> = ({ 
    links,
    isLoading = false,
    error = null 
}) => {
    const handleExternalLink = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const link = e.currentTarget;
        if (link.href) {
            await open(link.href);
        }
    };

    if (isLoading) {
        return <div>Loading links...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Links:</h2>
            <ul className="list-disc pl-5 space-y-2">
                {links.map((link, index) => (
                    <li key={index}>
                        <a
                            href={link.link}
                            onClick={handleExternalLink}
                            className="text-blue-500 underline"
                        >
                            {link.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LinkList;