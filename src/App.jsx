import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
const [currentDate,setCurrentDate]=useState(new Date());
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");

const dateKey=currentDate.toISOString().split("T")[0];


  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    if (editId) {
      setTasks(
        tasks.map((task) =>
          task.id === editId ? { ...task, text: input } : task
        )
      );
      setEditId(null);
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: input,
          date:dateKey,
          completed:false,
        },
      ]);
    }

    setInput("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (task) => {
    setInput(task.text);
    setEditId(task.id);
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };


  const filteredTasks = tasks.filter((task) => {
  const matchesDate = task.date === dateKey;
  
  if (filter === "completed") return matchesDate && task.completed;
  if (filter === "pending") return matchesDate && !task.completed;
  return matchesDate; // في حالة "all" يعيد فقط المهام التي تطابق التاريخ
});

  const total=filteredTasks.length;
    const completed=filteredTasks.filter(tasks=>tasks.completed).length;
    const pending=filteredTasks.filter(tasks=>!tasks.completed).length;



  return (
    
    <div className="container">
      
<h1>ToDoList</h1>
      <p className="date">{currentDate.toDateString()}</p>


      <div className="input-box">

        <input 
          type="text"
          placeholder="Write the task"
          value={input}
          dir="auto"
          onChange={(e) => setInput(e.target.value)}
          />  
           <button  onClick={handleSubmit}>
          {editId ? "حفظ" : "Add"}
        </button>   
      </div>
       
     <h2>Tasks :</h2>
      
    
 <div className="filters">
        <button onClick={() => setFilter("all")}>
              ({total})All        </button>

        <button onClick={() => setFilter("pending")}>
         ({pending}) Incomplete
        </button>

        <button onClick={() => setFilter("completed")}>
         ({completed}) Complete
        </button>
        
      </div >
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <div className="left">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />

              <span
                className={task.completed ? "completed" : ""}
              >
                {task.text}
              </span>
            </div>

            <div className="actions">
              <button onClick={() => editTask(task)}>
                ✏️
              </button>

              <button onClick={() => deleteTask(task.id)}>
                🗑️
              </button>
            </div>

     
          </li>
        ))}
      </ul>
{/* منطقة الزرين فقط */}
<div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "30px" }}>
  <button 
    onClick={() => setCurrentDate(new Date())}
    style={{ padding: "10px 20px", cursor: "pointer" ,backgroundColor:"#510f0f"}}
  >
    today
  </button>
  <button 
    onClick={() => {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      setCurrentDate(prevDate);
    }}
    style={{ padding: "10px 20px", cursor: "pointer" ,backgroundColor:"#510f0f" }}
  >
    prev
  </button>

  
</div>

  
      
    </div>
    
  );
  
}

export default App;