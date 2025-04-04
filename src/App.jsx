import { useState, useEffect } from "react";
import TodoList from "./components/TodoList";
import "./App.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  return (
    <div>
      <h1 className={isDarkMode ? "dark-text" : ""}>React TODO App</h1>
      <div className="theme-switch-container">
        <label className="switch">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
          />
          <span className="slider"></span>
        </label>
      </div>
      <TodoList isDarkMode={isDarkMode} />
    </div>
  );
}

export default App;
