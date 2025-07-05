import React, { useState, useEffect } from 'react';
import './TodoList.css';

/**
 * Composant principal TodoList
 * Gère une liste de tâches avec catégories, filtres, drag & drop et persistance localStorage
 */
function TodoList() {
  // État des tâches : récupération depuis localStorage au chargement
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  // Sauvegarde automatique dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);


  // État pour le texte de la nouvelle tâche
  const [newTask, setNewTask] = useState('');

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return; // Éviter les tâches vides
    addTask();
    setNewTask(''); // Vider le champ après ajout
  };

  // Gestion du changement de texte dans l'input
  const handleChange = (e) => {
    setNewTask(e.target.value);
  };

  // Suppression d'une tâche par son index
  const handleDelete = (indexToRemove) => {
    setTasks(tasks.filter((_, i) => i !== indexToRemove));
  };

  // Basculer l'état terminé/non terminé d'une tâche
  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  // Création d'une nouvelle tâche avec toutes ses propriétés
  const addTask = () => {
    const newTaskObj = {
      id: Date.now(), // ID unique basé sur timestamp
      text: newTask.trim(),
      completed: false,
      category: selectedCategory,
      color: getCategoryColor(selectedCategory),
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTaskObj]);
  };

  // États pour les filtres
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Fonction de filtrage combiné (statut + catégorie)
  const getFilteredTasks = () => {
    let filtered = tasks;
    
    // Filtrage par statut (toutes/actives/terminées)
    switch (filter) {
      case 'active':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      default:
        // 'all' : pas de filtrage par statut
        break;
    }
    
    // Filtrage par catégorie
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(task => task.category === categoryFilter);
    }
    
    return filtered;
  };

  // États pour la gestion des tâches
  const [selectedCategory, setSelectedCategory] = useState('personnel');
  const [draggedTask, setDraggedTask] = useState(null); // ID de la tâche en cours de drag
  
  // Gestion des catégories personnalisées
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : [
      { id: 'personnel', name: 'Personnel', emoji: '👤', color: '#ff6b6b' },
      { id: 'travail', name: 'Travail', emoji: '💼', color: '#4ecdc4' },
      { id: 'urgent', name: 'Urgent', emoji: '⚡', color: '#ffa726' }
    ];
  });
  
  // État pour l'ajout de nouvelle catégorie
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('📝');
  
  // Liste d'emojis populaires pour les catégories
  // Sélection soigneusement choisie pour couvrir différents types d'activités
  const categoryEmojiOptions = [
    '📝', '💼', '🏠', '💡', '🎯', '⚡', '🚀', '💻', '📚', '🎨',
    '🏃', '🍎', '🎵', '🛒', '💰', '🔥', '⭐', '🌟', '🎉', '🎯',
    '📊', '📈', '🔧', '🎪', '🌈', '🎭', '🎬', '📱', '⚙️', '🔔'
  ];
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showManageCategories, setShowManageCategories] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Pour la confirmation de suppression
  
  // Sauvegarde des catégories dans localStorage
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Mapping des couleurs par catégorie (maintenant dynamique)
  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#667eea'; // Couleur par défaut
  };
  
  // Trouver une catégorie par ID
  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === categoryId);
  };
  
  // Générer une couleur aléatoire pour les nouvelles catégories
  const generateRandomColor = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffa726', '#9b59b6', '#3498db', '#e74c3c', '#2ecc71', '#f39c12'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Ajouter une nouvelle catégorie
  const addCategory = () => {
    if (newCategoryName.trim() === '') return;
    
    const newCategory = {
      id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
      name: newCategoryName.trim(),
      emoji: newCategoryEmoji,
      color: generateRandomColor()
    };
    
    // Vérifier si la catégorie existe déjà
    if (categories.find(cat => cat.id === newCategory.id)) {
      alert('Cette catégorie existe déjà !');
      return;
    }
    
    setCategories([...categories, newCategory]);
    setSelectedCategory(newCategory.id); // Sélectionner automatiquement la nouvelle catégorie
    setNewCategoryName('');
    setNewCategoryEmoji('📝');
    setShowAddCategory(false);
  };
  
  // Supprimer une catégorie (seulement les catégories personnalisées)
  const deleteCategory = (categoryId) => {
    // Empêcher la suppression des catégories par défaut
    const defaultCategories = ['personnel', 'travail', 'urgent'];
    if (defaultCategories.includes(categoryId)) {
      alert('Impossible de supprimer les catégories par défaut !');
      return;
    }
    
    setCategoryToDelete(categoryId);
  };
  
  // Confirmer la suppression de catégorie
  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(cat => cat.id !== categoryToDelete));
      // Si c'était la catégorie sélectionnée, revenir à "personnel"
      if (selectedCategory === categoryToDelete) {
        setSelectedCategory('personnel');
      }
      setCategoryToDelete(null);
    }
  };
  
  // Annuler la suppression de catégorie
  const cancelDeleteCategory = () => {
    setCategoryToDelete(null);
  };

  /**
   * FONCTIONS DRAG & DROP
   * Permettent de réorganiser les tâches par glisser-déposer
   */
  
  // Début du drag : enregistre la tâche draggée
  const handleDragStart = (e, taskId) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.dataTransfer.setDragImage(e.target, 0, 0);
  };

  // Survol pendant le drag : permet le drop + effet visuel
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
  };

  // Entrée dans la zone de drop : effet visuel
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  // Sortie de la zone de drop : retire l'effet visuel
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  // Drop : réorganise les tâches dans le tableau
  const handleDrop = (e, targetTaskId) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    // Si on drop sur la même tâche, on annule
    if (draggedTask === targetTaskId) {
      setDraggedTask(null);
      return;
    }

    // Trouver les index des tâches source et cible
    const draggedIndex = tasks.findIndex(task => task.id === draggedTask);
    const targetIndex = tasks.findIndex(task => task.id === targetTaskId);
    
    // Réorganiser si les deux tâches existent
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

  // Fin du drag : nettoyage des effets visuels
  const handleDragEnd = (e) => {
    setDraggedTask(null);
    // Nettoyer toutes les classes drag-over restantes
    document.querySelectorAll('.drag-over').forEach(el => {
      el.classList.remove('drag-over');
    });
  };

  return (
    <div className="app">
      <h1>Ma Todo List</h1>

      {/* Formulaire d'ajout de tâche */}
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
          onChange={(e) => {
            if (e.target.value === 'add-new') {
              setShowAddCategory(true);
            } else {
              setSelectedCategory(e.target.value);
            }
          }}
          className="category-select"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.emoji} {category.name}
            </option>
          ))}
          <option value="add-new" style={{fontStyle: 'italic', color: '#666'}}>
            + Ajouter une catégorie...
          </option>
        </select>
        
        <button className="add-button" type="submit">Ajouter</button>
      </form>

      {/* Formulaire d'ajout de catégorie */}
      {showAddCategory && (
        <div className="add-category-form">
          <input
            type="text"
            placeholder="Nom de la catégorie"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="category-name-input"
          />
          <select
            value={newCategoryEmoji}
            onChange={(e) => setNewCategoryEmoji(e.target.value)}
            className="category-emoji-select"
            title="Sélectionner un emoji pour la catégorie"
          >
            {categoryEmojiOptions.map(emoji => (
              <option key={emoji} value={emoji}>{emoji}</option>
            ))}
          </select>
          <button type="button" onClick={addCategory} className="confirm-category-button">
            ✓
          </button>
          <button type="button" onClick={() => {
            setShowAddCategory(false);
            setNewCategoryName('');
            setNewCategoryEmoji('📝');
          }} className="cancel-category-button">
            ✕
          </button>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {categoryToDelete && (
        <div className="delete-confirmation-modal">
          <div className="delete-confirmation-content">
            <h3>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer cette catégorie ?</p>
            <div className="delete-confirmation-buttons">
              <button onClick={confirmDeleteCategory} className="confirm-delete-button">
                Oui, supprimer
              </button>
              <button onClick={cancelDeleteCategory} className="cancel-delete-button">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Container des filtres */}
      <div className="filters-container">
        {/* Filtres par statut */}
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
        
        {/* Filtre par catégorie */}
        <select 
          value={categoryFilter}
          onChange={(e) => {
            if (e.target.value === 'manage-categories') {
              setShowManageCategories(true);
            } else {
              setCategoryFilter(e.target.value);
            }
          }}
          className="category-filter-select"
        >
          <option value="all">🏠 Toutes catégories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.emoji} {category.name}
            </option>
          ))}
          <option value="manage-categories" style={{fontStyle: 'italic', color: '#666'}}>
            ⚙️ Gérer les catégories...
          </option>
        </select>
      </div>

      {/* Gestion des catégories */}
      {showManageCategories && (
        <div className="category-management">
          <div className="category-management-header">
            <h3>Gérer les catégories</h3>
            <button 
              onClick={() => setShowManageCategories(false)}
              className="close-management-button"
              title="Fermer la gestion des catégories"
            >
              ✕
            </button>
          </div>
          <div className="category-list">
            {categories.map(category => {
              const isDefault = ['personnel', 'travail', 'urgent'].includes(category.id);
              return (
                <div key={category.id} className="category-item">
                  <span className="category-info">
                    {category.emoji} {category.name}
                  </span>
                  {!isDefault && (
                    <button 
                      onClick={() => deleteCategory(category.id)}
                      className="delete-category-button"
                      title="Supprimer cette catégorie"
                    >
                      ✖
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {categories.length === 3 && (
            <div className="no-custom-categories">
              <p>Vous n'avez que les catégories par défaut.</p>
              <p>Créez une nouvelle catégorie via le formulaire d'ajout de tâche !</p>
            </div>
          )}
        </div>
      )}

      {/* Liste des tâches filtrées */}
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
            {/* Poignée de drag & drop */}
            <div 
              className="drag-handle"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, task.id)}
            >
              ⋮⋮
            </div>
            
            {/* Checkbox pour marquer comme terminé */}
            <input 
              type="checkbox" 
              checked={task.completed || false}
              onChange={() => toggleComplete(task.id)}
              className="task-checkbox"
            />
            
            {/* Texte de la tâche */}
            <span className={`task-text ${task.completed ? 'completed' : ''}`}>
              {task.text || task}
            </span>
            
            {/* Badge de catégorie */}
            {task.category && (
              <span 
                className="task-category"
                style={{ backgroundColor: task.color || getCategoryColor(task.category) }}
              >
                {(() => {
                  const category = getCategoryById(task.category);
                  return category ? category.emoji : '�';
                })()}
                {(() => {
                  const category = getCategoryById(task.category);
                  return category ? category.name : task.category;
                })()}
              </span>
            )}
            
            {/* Bouton de suppression */}
            <button className="delete-button" onClick={() => handleDelete(index)}>✖</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
