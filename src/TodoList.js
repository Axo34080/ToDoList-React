import React, { useState, useEffect } from 'react';
import './TodoList.css';



// This is a simple To-Do List application built with React.
function TodoList() {
  const [tasks, setTasks] = useState(() => {
  const savedTasks = localStorage.getItem('tasks');
  return savedTasks ? JSON.parse(savedTasks) : [];
});
  useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}, [tasks]);


  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    addTask();
    setNewTask('');
  };

  const handleChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleDelete = (indexToRemove) => {
  setTasks(tasks.filter((_, i) => i !== indexToRemove));
};

const toggleComplete = (taskId) => {
  setTasks(tasks.map(task => 
    task.id === taskId 
      ? { ...task, completed: !task.completed }
      : task
  ));
};

const addTask = () => {
  const newTaskObj = {
    id: Date.now(), // ou uuid
    text: newTask.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
  setTasks([...tasks, newTaskObj]);
};

const saveToLocalStorage = (tasks) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Erreur sauvegarde localStorage:', error);
  }
};

const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
const getFilteredTasks = () => {
  switch (filter) {
    case 'active':
      return tasks.filter(task => !task.completed);
    case 'completed':
      return tasks.filter(task => task.completed);
    default:
      return tasks;
  }
};

  return (
  <div className="app">
    <h1>Ma Todo List</h1>

    <form className="form" onSubmit={handleSubmit}>
      <input
        className="input"
        type="text"
        placeholder="Ajouter une tâche"
        value={newTask}
        onChange={handleChange}
      />
      <button className="add-button" type="submit">Ajouter</button>
    </form>

    <div className="filter-buttons">
  <button 
    className={filter === 'all' ? 'active' : ''}
    onClick={() => setFilter('all')}
  >
    Toutes
  </button>
  <button 
    className={filter === 'active' ? 'active' : ''}
    onClick={() => setFilter('active')}
  >
    Actives
  </button>
  <button 
    className={filter === 'completed' ? 'active' : ''}
    onClick={() => setFilter('completed')}
  >
    Terminées
  </button>
</div>

    <ul className="task-list">
      {getFilteredTasks().map((task, index) => (
        <li className={`task-item ${task.completed ? 'completed' : ''}`} key={task.id || index}>
          <input 
            type="checkbox" 
            checked={task.completed || false}
            onChange={() => toggleComplete(task.id)}
            className="task-checkbox"
          />
          <span className={`task-text ${task.completed ? 'completed' : ''}`}>
            {task.text || task}
          </span>
          <button className="delete-button" onClick={() => handleDelete(index)}>✖</button>
        </li>
      ))}
    </ul>
  </div>
);

}

export default TodoList;
