import React from 'react';
import { open } from '@tauri-apps/plugin-shell';

interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children: React.ReactNode;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ children, href, onClick, ...props }) => {
    const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (href) {
            try {
                await open(href);
            } catch (error) {
                console.error('Failed to open link:', error);
            }
        }
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            {...props}
        >
            {children}
        </a>
    );
};

export default ExternalLink;