import React, { useState } from 'react';
import './TodoList.css';



// This is a simple To-Do List application built with React.
function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    setTasks([...tasks, newTask.trim()]);
    setNewTask('');
  };

  const handleChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleDelete = (indexToRemove) => {
  setTasks(tasks.filter((_, i) => i !== indexToRemove));
};


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ajouter une tâche"
          value={newTask}
          onChange={handleChange}
        />
        <button type="submit">Ajouter</button>
      </form>

      <ul>
        {tasks.map((task, index) => (
  <li key={index}>
    {task}
    <button className="delete-button" onClick={() => handleDelete(index)}>✖</button>

  </li>
    ))}

      </ul>
    </div>
  );
}

export default TodoList;
