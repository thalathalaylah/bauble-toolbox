import { useState, useCallback } from 'react';
import { invoke } from "@tauri-apps/api/core";
import { Task } from '../types';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async (name: string = "") => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedTasks: Task[] = await invoke('get_tasks', { name });
            setTasks(fetchedTasks);
            setCheckedItems(new Array(fetchedTasks.length).fill(false));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An error occurred while fetching tasks');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleCheckboxChange = useCallback((index: number) => {
        setCheckedItems(prevCheckedItems => {
            const newCheckedItems = [...prevCheckedItems];
            newCheckedItems[index] = !newCheckedItems[index];
            return newCheckedItems;
        });
    }, []);

    return {
        tasks,
        checkedItems,
        isLoading,
        error,
        fetchTasks,
        handleCheckboxChange
    };
};