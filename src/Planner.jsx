import React, {useState, useEffect} from 'react'

function Planner(){

    //preload local storage and curated tasks
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem("mtTodo");
        return savedTasks ? JSON.parse(savedTasks) : [
            { text: "MP", completed: false },
            { text: "UHHHHH", completed: false }
        ];
    });

   const [tasksWeek, setTasksWeek] = useState(() => {
        const savedTasksWeek = localStorage.getItem("weekTodo");
        return savedTasksWeek ? JSON.parse(savedTasksWeek) : [
            { text: "Lotus", completed: false },
            { text: "Damien", completed: false },
            { text: "Tenebris", completed: false },
            { text: "UHHHHH", completed: false }
        ];
    });

    
    const [newTask, setNewTask] = useState("");
    const [newTaskWeek, setNewTaskWeek] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [lastResetDate, setLastResetDate] = useState(() => {
        //get last reset date from localStorage or use current date
        const savedDate = localStorage.getItem("lastResetDate");
        return savedDate ? new Date(savedDate) : new Date();
    });

   //save both daily/weekly tasks to localStorage on update
   useEffect(() => {
    localStorage.setItem("mtTodo", JSON.stringify(tasks));
}, [tasks]);    

   useEffect(() => {
        localStorage.setItem("weekTodo", JSON.stringify(tasksWeek));
    }, [tasksWeek]);

//update clock
useEffect(() => {
    const timer = setInterval(() => {
        setCurrentTime(new Date());
    }, 1000); //updates every second

    return () => clearInterval(timer);
}, []);

// Format time for display
const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'UTC'
    }) + ' UTC';
};

//display date
const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    });
};
//reformat these blocks above
    
 // Function to check if it's a new day (after midnight UTC)
    const checkForReset = () => {
        const now = new Date();
        const currentUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
        const lastResetUTC = new Date(
            lastResetDate.getUTCFullYear(), 
            lastResetDate.getUTCMonth(), 
            lastResetDate.getUTCDate()
        );

        if (currentUTC > lastResetUTC) {
            //DAILY RESET OMG
            setTasks([]);
            setLastResetDate(now);
            localStorage.setItem("lastResetDate", now.toISOString());
            
            // Optional: Also check for weekly reset (e.g., on Monday)
            if (now.getUTCDay() === 1) { // Monday
                // Reset weekly tasks here if needed
            }
        }
    };

    //set up interval to check for reset
    useEffect(() => {
        checkForReset();
        const intervalId = setInterval(checkForReset, 60000);
        return () => clearInterval(intervalId);
    }, [lastResetDate]);

    //DAILY STARTS HERE
    const handleInputChange = (event) => {
        setNewTask(event.target.value);
    };

    const addTask = () => {
        if (newTask.trim() !== "") {
            setTasks([...tasks, { text: newTask, completed: false }]);
            setNewTask("");
        }
    };

    const deleteTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    const moveTaskUp = (index) => {
        if (index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] = 
                [updatedTasks[index - 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    };

    const moveTaskDown = (index) => {
        if (index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] = 
                [updatedTasks[index + 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    };

    const markTask = (index) => {
        setTasks(tasks.map((task, i) => 
            i === index ? { ...task, completed: !task.completed } : task
        ));
    };

    //WEEKLY STARTS HERE
    const handleInputChangeWeek = (event) => {
        setNewTaskWeek(event.target.value);
    };

    const addTaskWeek = () => {
        if (newTaskWeek.trim() !== "") {
            setTasksWeek([...tasksWeek, { text: newTaskWeek, completed: false }]);
            setNewTaskWeek("");
        }
    };

    const deleteTaskWeek = (index) => {
        const updatedTasksWeek = tasksWeek.filter((_, i) => i !== index);
        setTasksWeek(updatedTasksWeek);
    };

    const moveTaskUpWeek = (index) => {
        if (index > 0) {
            const updatedTasksWeek = [...tasksWeek];
            [updatedTasksWeek[index], updatedTasksWeek[index - 1]] = 
                [updatedTasksWeek[index - 1], updatedTasksWeek[index]];
            setTasksWeek(updatedTasksWeek);
        }
    };

    const moveTaskDownWeek = (index) => {
        if (index < tasksWeek.length - 1) {
            const updatedTasksWeek = [...tasksWeek];
            [updatedTasksWeek[index], updatedTasksWeek[index + 1]] = 
                [updatedTasksWeek[index + 1], updatedTasksWeek[index]];
            setTasksWeek(updatedTasksWeek);
        }
    };

    const markTaskWeek = (index) => {
        setTasksWeek(tasksWeek.map((task, i) => 
            i === index ? { ...task, completed: !task.completed } : task
        ));
    };

    return(
<div className="planner">
            <div className="time-display">
                <h1>Maple Planner</h1>
                <h2>{formatDate(currentTime)}</h2>
                <h3>{formatTime(currentTime)}</h3>
                <p>Daily reset occurs at midnight UTC | Weekly reset is Thursday UTC</p>
            </div>

            <div className="task-sections">
                <div className="daily-tasks">
                    <h1>Daily Tasks</h1>
                    <div>
                        <input 
                            type="text" 
                            placeholder="Add daily task" 
                            value={newTask}
                            onChange={handleInputChange}
                        />
                        <button className="add-button" onClick={addTask}>
                            Add Daily
                        </button>
                    </div>
                    <ol>
                        {tasks.map((task, index) => (
                            <li key={index} className={task.completed ? "complete" : ""}>
                                <span 
                                    className="text" 
                                    style={{
                                        textDecoration: task.completed ? "line-through" : "none",
                                        color: task.completed ? "#888" : "inherit"
                                    }}
                                >
                                    {task.text}
                                </span>
                                <button
                                    className="delete-button"
                                    onClick={() => deleteTask(index)}>
                                    X
                                </button>
                                <button 
                                    className="move-button" 
                                    onClick={() => markTask(index)}
                                    style={{ backgroundColor: task.completed ? "#4CAF50" : "#f44336" }}
                                >
                                    {task.completed ? "Completed!" : "Mark Done"}
                                </button>
                                <button
                                    className="move-button"
                                    onClick={() => moveTaskUp(index)}>
                                    ▲
                                </button>
                                <button
                                    className="move-button"
                                    onClick={() => moveTaskDown(index)}>
                                    ▼
                                </button>
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="weekly-tasks">
                    <h1>Weekly Tasks</h1>
                    <div>
                        <input 
                            type="text" 
                            placeholder="Add weekly task" 
                            value={newTaskWeek}
                            onChange={handleInputChangeWeek}
                        />
                        <button className="add-button" onClick={addTaskWeek}>
                            Add Weekly
                        </button>
                    </div>
                    <ol>
                        {tasksWeek.map((task, index) => (
                            <li key={index} className={task.completed ? "complete" : ""}>
                                <span 
                                    className="text" 
                                    style={{
                                        textDecoration: task.completed ? "line-through" : "none",
                                        color: task.completed ? "#888" : "inherit"
                                    }}
                                >
                                    {task.text}
                                </span>
                                <button
                                    className="delete-button"
                                    onClick={() => deleteTaskWeek(index)}>
                                    X
                                </button>
                                <button 
                                    className="move-button" 
                                    onClick={() => markTaskWeek(index)}
                                    style={{ backgroundColor: task.completed ? "#4CAF50" : "#f44336" }}
                                >
                                    {task.completed ? "Completed!" : "Mark Done"}
                                </button>
                                <button
                                    className="move-button"
                                    onClick={() => moveTaskUpWeek(index)}>
                                    ▲
                                </button>
                                <button
                                    className="move-button"
                                    onClick={() => moveTaskDownWeek(index)}>
                                    ▼
                                </button>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
}

export default Planner