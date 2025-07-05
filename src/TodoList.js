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
    id: Date.now(),
    text: newTask.trim(),
    completed: false,
    category: selectedCategory,
    color: getCategoryColor(selectedCategory),
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
const [categoryFilter, setCategoryFilter] = useState('all');

const getFilteredTasks = () => {
  let filtered = tasks;
  
  // Filtre par statut (comme actuellement)
  switch (filter) {
    case 'active':
      filtered = filtered.filter(task => !task.completed);
      break;
    case 'completed':
      filtered = filtered.filter(task => task.completed);
      break;
  }
  
  // Filtre par catégorie
  if (categoryFilter !== 'all') {
    filtered = filtered.filter(task => task.category === categoryFilter);
  }
  
  return filtered;
};

const [selectedCategory, setSelectedCategory] = useState('personnel');
const [draggedTask, setDraggedTask] = useState(null);

const getCategoryColor = (category) => {
  const colors = {
    personnel: '#ff6b6b',
    travail: '#4ecdc4', 
    urgent: '#ffa726'
  };
  return colors[category] || '#667eea';
};

// Fonctions pour le drag & drop
const handleDragStart = (e, taskId) => {
  setDraggedTask(taskId);
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.target.outerHTML);
  e.dataTransfer.setDragImage(e.target, 0, 0);
};

const handleDragOver = (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
};

const handleDragEnter = (e) => {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
};

const handleDragLeave = (e) => {
  e.currentTarget.classList.remove('drag-over');
};

const handleDrop = (e, targetTaskId) => {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  
  if (draggedTask === targetTaskId) {
    setDraggedTask(null);
    return;
  }

  const draggedIndex = tasks.findIndex(task => task.id === draggedTask);
  const targetIndex = tasks.findIndex(task => task.id === targetTaskId);
  
  if (draggedIndex !== -1 && targetIndex !== -1) {
    const newTasks = [...tasks];
    const draggedTaskObj = newTasks[draggedIndex];
    
    // Supprimer la tâche de sa position actuelle
    newTasks.splice(draggedIndex, 1);
    
    // Insérer la tâche à sa nouvelle position
    newTasks.splice(targetIndex, 0, draggedTaskObj);
    
    setTasks(newTasks);
  }
  
  setDraggedTask(null);
};

const handleDragEnd = (e) => {
  setDraggedTask(null);
  // Nettoyer toutes les classes drag-over
  document.querySelectorAll('.drag-over').forEach(el => {
    el.classList.remove('drag-over');
  });
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
      <select 
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="category-select"
      >
        <option value="personnel">👤 Personnel</option>
        <option value="travail">💼 Travail</option>
        <option value="urgent">⚡ Urgent</option>
      </select>
      <button className="add-button" type="submit">Ajouter</button>
    </form>

    <div className="filters-container">
      <div className="status-filter-buttons">
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
      
      <select 
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="category-filter-select"
      >
        <option value="all">🏠 Toutes catégories</option>
        <option value="personnel">👤 Personnel</option>
        <option value="travail">💼 Travail</option>
        <option value="urgent">⚡ Urgent</option>
      </select>
    </div>

    <ul className="task-list">
      {getFilteredTasks().map((task, index) => (
        <li 
          className={`task-item ${task.completed ? 'completed' : ''} ${draggedTask === task.id ? 'dragging' : ''}`} 
          key={task.id || index}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, task.id)}
          onDragEnd={handleDragEnd}
        >
          <div 
            className="drag-handle"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, task.id)}
          >
            ⋮⋮
          </div>
          <input 
            type="checkbox" 
            checked={task.completed || false}
            onChange={() => toggleComplete(task.id)}
            className="task-checkbox"
          />
          <span className={`task-text ${task.completed ? 'completed' : ''}`}>
            {task.text || task}
          </span>
          {task.category && (
            <span 
              className="task-category"
              style={{ backgroundColor: task.color || getCategoryColor(task.category) }}
            >
              {task.category === 'personnel' && '👤'}
              {task.category === 'travail' && '💼'}
              {task.category === 'urgent' && '⚡'}
              {task.category}
            </span>
          )}
          <button className="delete-button" onClick={() => handleDelete(index)}>✖</button>
        </li>
      ))}
    </ul>
  </div>
);

}

export default TodoList;
