import { useEffect } from "react";
import "./App.css";
import "./index.css"
import TaskList from './components/Tasks/TaskList';
import LinkList from './components/Links/LinkList';
import { useTasks } from './hooks/useTasks';
import { useLinks } from './hooks/useLinks';

function App() {
    const { tasks, checkedItems, isLoading: tasksLoading, error: tasksError, fetchTasks, handleCheckboxChange } = useTasks();
    const { links, isLoading: linksLoading, error: linksError, fetchLinks } = useLinks();

    useEffect(() => {
        fetchTasks()
        fetchLinks()
    }, [fetchTasks, fetchLinks])

    return (
        <div className="container">
            <TaskList 
                tasks={tasks} 
                checkedItems={checkedItems} 
                onCheckboxChange={handleCheckboxChange}
                isLoading={tasksLoading}
                error={tasksError}
            />
            
            <LinkList 
                links={links}
                isLoading={linksLoading}
                error={linksError}
            />
        </div>
    );
}

export default App