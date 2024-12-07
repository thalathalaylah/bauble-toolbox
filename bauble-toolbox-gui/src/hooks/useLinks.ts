import { useState, useCallback } from 'react';
import { invoke } from "@tauri-apps/api/core";
import { Link } from '../types';

export const useLinks = () => {
    const [links, setLinks] = useState<Link[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLinks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedLinks: Link[] = await invoke('get_links');
            setLinks(fetchedLinks);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An error occurred while fetching links');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        links,
        isLoading,
        error,
        fetchLinks
    };
};