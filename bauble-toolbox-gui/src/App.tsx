import {useEffect, useState} from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import "./index.css"

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [strings, setStrings] = useState<string[]>([]);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  async function fetchStrings() {
      try {
          const strings: string[] = await invoke('get_strings')
          setStrings(strings);
      } catch (e) {
          console.error(e)
      }
  }

  useEffect(() => {
      fetchStrings()
  }, [])
  fetchStrings()

  return (
      <div className="container">
          <h1>Welcome to Tauri!</h1>
          <h1 className="text-3xl font-bold underline">
              Hello world!
          </h1>
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
              <h2>Fetched Strings:</h2>
              <ul>
                  {strings.map((str, index) => (
                      <li key={index}>{str}</li>
                  ))}
              </ul>
          </div>
      </div>
  );
}

export default App;
