import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import "./index.css"
import { open } from '@tauri-apps/plugin-shell'
import TaskList from './components/Tasks/TaskList';
import LinkList from './components/Links/LinkList';
import { useTasks } from './hooks/useTasks';
import { useLinks } from './hooks/useLinks';

function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");
    const { tasks, checkedItems, isLoading: tasksLoading, error: tasksError, fetchTasks, handleCheckboxChange } = useTasks();
    const { links, isLoading: linksLoading, error: linksError, fetchLinks } = useLinks();

    async function greet() {
        setGreetMsg(await invoke("greet", { name }));
    }

    useEffect(() => {
        fetchTasks()
        fetchLinks()
    }, [fetchTasks, fetchLinks])

    const handleExternalLink = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const link = e.currentTarget;
        if (link.href) {
            await open(link.href);
        }
    };

    return (
        <div className="container">
            <h1>Welcome to Tauri!</h1>
            <h1 className="text-3xl font-bold underline">
                Hello world!
            </h1>
            <a href="https://example.com" onClick={handleExternalLink}>外部リンク</a>

            <button className="btn btn-primary w-64 rounded-full">Button</button>
            <div className="row">
                <a href="https://vitejs.dev" target="_blank">
                    <img src="/vite.svg" className="logo vite" alt="Vite logo"/>
                </a>
                <a href="https://tauri.app" target="_blank">
                    <img src="/tauri.svg" className="logo tauri" alt="Tauri logo"/>
                </a>
                <a href="https://reactjs.org" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>

            <p>Click on the Tauri, Vite, and React logos to learn more.</p>

            <form
                className="row"
                onSubmit={(e) => {
                    e.preventDefault();
                    greet();
                }}
            >
                <input
                    id="greet-input"
                    onChange={(e) => setName(e.currentTarget.value)}
                    placeholder="Enter a name..."
                />
                <button type="submit">Greet</button>
            </form>

            <p>{greetMsg}</p>
            
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