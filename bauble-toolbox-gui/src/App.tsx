import {useEffect, useState} from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import "./index.css"
import { open } from '@tauri-apps/plugin-shell'

function App() {
    type Task = { name: string };

    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        setGreetMsg(await invoke("greet", { name }));
    }

    async function fetchTasks() {
        try {
            const fetchedTasks: Task[] = await invoke('get_tasks', { name });
            setTasks(fetchedTasks);
            setCheckedItems(new Array(fetchedTasks.length).fill(false));
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    const handleCheckboxChange = (index: number) => {
        setCheckedItems(prevCheckedItems => {
            const newCheckedItems = [...prevCheckedItems];
            newCheckedItems[index] = !newCheckedItems[index];
            return newCheckedItems;
        });
    };

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
                                onChange={() => handleCheckboxChange(index)}
                            />
                            {task.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App
