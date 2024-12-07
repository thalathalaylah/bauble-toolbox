import React from 'react';
import { Task } from '../../types';
import { open } from '@tauri-apps/plugin-shell';

interface TaskListProps {
    tasks: Task[];
    checkedItems: boolean[];
    onCheckboxChange: (index: number) => void;
    isLoading?: boolean;
    error?: string | null;
}

const TaskList: React.FC<TaskListProps> = ({ 
    tasks, 
    checkedItems, 
    onCheckboxChange,
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
        return <div>Loading tasks...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Fetched Tasks:</h2>
            <ul className="list-disc pl-5 space-y-2">
                {tasks.map((task, index) => (
                    <li key={index}
                        className={`p-2 bg-gray-100 rounded-md shadow-md flex items-center ${checkedItems[index] ? 'line-through' : ''}`}>
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={checkedItems[index]}
                            onChange={() => onCheckboxChange(index)}
                        />
                        {task.link ? (
                            <a
                                href={task.link}
                                onClick={handleExternalLink}
                                className="text-blue-500 underline"
                            >
                                {task.name}
                            </a>
                        ) : (
                            task.name
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;