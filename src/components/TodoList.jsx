import { useEffect, useState } from "react";

export default function TodoList({ isDarkMode }) {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [filteredTasks, setFilteredTasks] = useState("all");
  const [editIndex, setEditIndex] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Use the environment variable

  // Fetch the tasks from the backend when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/`);
      const data = await response.json();
      console.log(data); // Log data to inspect if 'is_completed' is a boolean

      const mappedTasks = data.map((task) => ({
        id: task.id,
        title: task.title,
        completed: task.is_completed, // Should be a boolean (true/false)
      }));
      setTasks(mappedTasks);
    } catch (err) {
      console.log("Error fetching tasks:", err);
    }
  };

  // Add a new task to the backend and update the state
  const addTask = async () => {
    if (task.trim() === "") return;

    const newTask = {
      title: task,
      is_completed: false, // Default is completed = false
    };

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const createdTask = await response.json();
        setTasks([
          ...tasks,
          {
            id: createdTask.id,
            title: createdTask.title,
            completed: createdTask.is_completed, // Should be a boolean (true/false)
          },
        ]);
        setTask("");
      } else {
        console.error("Failed to create task");
      }
    } catch (err) {
      console.log("Error creating task:", err);
    }
  };

  // Save the edited task title to the backend
  const saveEdit = async (id) => {
    const updatedTask = {
      title: newTitle,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const updatedTaskData = await response.json();
        const updatedTasks = tasks.map((task) =>
          task.id === id ? { ...task, title: updatedTaskData.title } : task
        );
        setTasks(updatedTasks);
        setEditIndex(null);
        setNewTitle("");
      } else {
        console.error("Failed to update task");
      }
    } catch (err) {
      console.log("Error updating task:", err);
    }
  };

  // Remove a task from the backend and update the state
  const removeTask = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== id));
      } else {
        console.error("Failed to delete task");
      }
    } catch (err) {
      console.log("Error deleting task:", err);
    }
  };

  // Set task as completed (is_completed = true) and update in backend
  const markAsCompleted = async (id) => {
    const updatedTask = {
      is_completed: true, // Always set to true (completed)
    };

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const updatedTaskData = await response.json();
        console.log("Updated task data:", updatedTaskData); // Log to check the updated task data

        // Update the tasks state with the new completed status (set to true)
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id
              ? { ...task, completed: true } // Set completed to true
              : task
          )
        );
      } else {
        console.error("Failed to mark task as completed");
      }
    } catch (err) {
      console.log("Error marking task as completed:", err);
    }
  };

  // Handle task filtering (all, completed, pending)
  const handleFilterChange = (filter) => {
    setFilteredTasks(filter);
  };

  // Filter tasks based on their completion status
  const filteredTasksList = tasks.filter((task) => {
    if (filteredTasks === "completed") return task.completed;
    if (filteredTasks === "pending") return !task.completed;
    return true; // "all" filter: return everything
  });

  return (
    <div className={`todo-container ${isDarkMode ? "dark-mode" : ""}`}>
      <h2 className={isDarkMode ? "dark-text" : ""}>To-Do List</h2>

      <input
        type="text"
        placeholder="Add a new task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className={isDarkMode ? "dark-input" : ""}
      />
      <button onClick={addTask} className={isDarkMode ? "dark-button" : ""}>
        Add Task
      </button>

      <div>
        <button
          onClick={() => handleFilterChange("all")}
          className={isDarkMode ? "dark-button" : ""}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange("completed")}
          className={isDarkMode ? "dark-button" : ""}
        >
          Completed
        </button>
        <button
          onClick={() => handleFilterChange("pending")}
          className={isDarkMode ? "dark-button" : ""}
        >
          Pending
        </button>
      </div>

      <div className="task-list-container">
        <ul>
          {filteredTasksList.map((task) => (
            <li
              key={task.id}
              className={isDarkMode ? "dark-li" : ""}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "#6c757d" : "#000",
              }}
            >
              {editIndex === task.id ? (
                <div>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={isDarkMode ? "dark-input" : ""}
                  />
                  <button
                    onClick={() => saveEdit(task.id)}
                    className={isDarkMode ? "dark-button" : ""}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  <h3>{task.title}</h3>
                  <button
                    onClick={() => {
                      setEditIndex(task.id);
                      setNewTitle(task.title);
                    }}
                    className={isDarkMode ? "dark-button" : ""}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeTask(task.id)}
                    className={isDarkMode ? "dark-button" : ""}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => markAsCompleted(task.id)} // Mark as completed (always sets to true)
                    className={isDarkMode ? "dark-button" : ""}
                  >
                    {task.completed ? "Completed" : "Mark as Complete"}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
