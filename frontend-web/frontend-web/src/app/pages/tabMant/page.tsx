"use client";

import React, { useState, useEffect } from 'react';
import styles from '../../styles/tabMant.module.css';
import { FiEdit, FiTrash2, FiPlus, FiAlertTriangle, FiCpu, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import calendarService, { Task } from '../../services/calendarService';

const MaintenanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [showAITasks, setShowAITasks] = useState(false);
  const [showUrgentTasks, setShowUrgentTasks] = useState(false);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [selectedAITasks, setSelectedAITasks] = useState<Task[]>([]);
  const [selectedUrgentTasks, setSelectedUrgentTasks] = useState<Task[]>([]);
  const [showTaskSelection, setShowTaskSelection] = useState(false);
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiTasksCount, setAITasksCount] = useState(0);
  const [urgentTasksCount, setUrgentTasksCount] = useState(0);

  const defaultRoutineTasks = [
    {
      id: 1,
      description: 'Vérification des équipements',
      statut: 'En attente',
      date_debut: '',
      technicien: 1,
      schedule: 1,
      priority: 'normal'
    },
    {
      id: 2,
      description: 'Nettoyage des machines',
      statut: 'En attente',
      date_debut: '',
      technicien: 1,
      schedule: 1,
      priority: 'normal'
    },
    {
      id: 3,
      description: 'Contrôle de sécurité',
      statut: 'En attente',
      date_debut: '',
      technicien: 1,
      schedule: 1,
      priority: 'normal'
    }
  ];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await calendarService.getTasks();
        if (fetchedTasks.length > 0) {
          setTasks(fetchedTasks);
        } else {
          const initialTasks = defaultRoutineTasks.map(task => ({
            ...task,
            date_debut: new Date().toISOString()
          }));
          setTasks(initialTasks);
        }
      } catch (err) {
        setError('فشل في جلب المهام من الخادم');
        const initialTasks = defaultRoutineTasks.map(task => ({
          ...task,
          date_debut: new Date().toISOString()
        }));
        setTasks(initialTasks);
      }
    };

    const fetchTaskCounts = async () => {
      try {
        const aiTasks = await calendarService.getAITasks();
        const urgentTasks = await calendarService.getUrgentTasks();
        setAITasksCount(aiTasks.length);
        setUrgentTasksCount(urgentTasks.length);
      } catch (err) {
        setError('فشل في جلب عدد المهام');
      }
    };

    fetchTasks();
    fetchTaskCounts();
  }, []);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const days = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const days = generateCalendarDays();
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  
  const getTasksForDate = (day: number | null) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return tasks.filter(task => task.date_debut.startsWith(dateStr));
  };

  const getAITasks = async () => {
    try {
      return await calendarService.getAITasks();
    } catch (err) {
      setError('فشل في جلب مهام الذكاء الاصطناعي');
      return [];
    }
  };

  const getUrgentTasks = async () => {
    try {
      return await calendarService.getUrgentTasks();
    } catch (err) {
      setError('فشل في جلب المهام العاجلة');
      return [];
    }
  };

  const hasIncompleteTasks = (day: number | null) => {
    const dateTasks = getTasksForDate(day);
    return dateTasks.some(task => task.statut !== 'Terminé') && dateTasks.length > 0;
  };

  const allTasksCompleted = (day: number | null) => {
    if (!day) return false;
    const dateTasks = getTasksForDate(day);
    return dateTasks.length > 0 && dateTasks.every(task => task.statut === 'Terminé');
  };

  const handleDateClick = (day: number | null) => {
    if (!day) return;
    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setShowTaskPanel(true);
  };

  const addTask = async () => {
    if (!newTask.trim() || !selectedDate) return;
    const newTaskObj: Omit<Task, 'id'> = {
      description: newTask,
      statut: 'En attente',
      date_debut: selectedDate,
      technicien: 1,
      schedule: 1,
      priority: 'normal'
    };
    try {
      const addedTask = await calendarService.addTask(newTaskObj);
      if (addedTask) {
        setTasks([...tasks, addedTask]);
        setNewTask('');
        setError(null);
      } else {
        setError('فشل في إضافة المهمة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء إضافة المهمة');
    }
  };

  const generateAITasks = () => {
    if (!selectedDate) return;
    const aiTasks = [
      {
        id: Date.now() + 1,
        description: 'Vérification automatique des systèmes',
        statut: 'En attente',
        date_debut: selectedDate,
        technicien: 1,
        schedule: 1,
        isAI: true,
        priority: 'normal'
      },
      {
        id: Date.now() + 2,
        description: 'Maintenance prédictive suggérée',
        statut: 'En attente',
        date_debut: selectedDate,
        technicien: 1,
        schedule: 1,
        isAI: true,
        priority: 'normal'
      }
    ];
    setTasks([...tasks, ...aiTasks]);
  };

  const toggleTaskCompletion = async (taskId: number) => {
    try {
      const success = await calendarService.accomplishTask(taskId);
      if (success) {
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, statut: 'Terminé', date_fin: new Date().toISOString() } : task
        ));
        setError(null);
      } else {
        setError('فشل في إتمام المهمة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء إتمام المهمة');
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const success = await calendarService.deleteTask(taskId);
      if (success) {
        setTasks(tasks.filter(task => task.id !== taskId));
        setError(null);
      } else {
        setError('فشل في حذف المهمة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء حذف المهمة');
    }
  };

  const startEditTask = (task: Task) => {
    setEditTaskId(task.id);
    setEditTaskText(task.description);
  };

  const saveEditedTask = async () => {
    if (!editTaskId) return;
    try {
      const updatedTask = await calendarService.updateTask(editTaskId, { description: editTaskText });
      if (updatedTask) {
        setTasks(tasks.map(task => task.id === editTaskId ? updatedTask : task));
        setEditTaskId(null);
        setError(null);
      } else {
        setError('فشل في تعديل المهمة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تعديل المهمة');
    }
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
    setSelectedDate(null);
    setShowTaskPanel(false);
  };

  const toggleAITaskSelection = (task: Task) => {
    setSelectedAITasks(prev => 
      prev.some(t => t.id === task.id) 
        ? prev.filter(t => t.id !== task.id) 
        : [...prev, task]
    );
  };

  const toggleUrgentTaskSelection = (task: Task) => {
    setSelectedUrgentTasks(prev => 
      prev.some(t => t.id === task.id) 
        ? prev.filter(t => t.id !== task.id) 
        : [...prev, task]
    );
  };

  const addSelectedTasks = async (taskList: Task[]) => {
    const tasksWithDate = taskList.map(task => ({
      ...task,
      date_debut: selectedDate || new Date().toISOString(),
      selected: false
    }));
    try {
      const addedTasks = await Promise.all(
        tasksWithDate.map(task => calendarService.addTask(task))
      );
      const validTasks = addedTasks.filter((task): task is Task => task !== null);
      setTasks([...tasks, ...validTasks]);
      setSelectedAITasks([]);
      setSelectedUrgentTasks([]);
      setShowTaskSelection(false);
      setShowAITasks(false);
      setShowUrgentTasks(false);
      setError(null);
    } catch (err) {
      setError('حدث خطأ أثناء إضافة المهام المختارة');
    }
  };

  return (
    <div className={styles.container}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <div className={styles.calendarSection}>
        <div className={styles.calendarHeader}>
          <button onClick={() => changeMonth(-1)} className={styles.navButton}>
            <FiChevronLeft />
          </button>
          <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button onClick={() => changeMonth(1)} className={styles.navButton}>
            <FiChevronRight />
          </button>
        </div>
        
        <div className={styles.calendarGrid}>
          {dayNames.map(day => (
            <div key={day} className={styles.dayHeader}>{day}</div>
          ))}
          
          {days.map((day, index) => (
            <div 
              key={index} 
              className={`${styles.day} ${day ? styles.hasDay : ''} 
                ${hasIncompleteTasks(day) ? styles.hasIncompleteTasks : ''}
                ${allTasksCompleted(day) ? styles.allTasksCompleted : ''}`}
              onClick={() => handleDateClick(day)}
            >
              {day}
              {allTasksCompleted(day) && <span className={styles.completedIndicator}>✓</span>}
            </div>
          ))}
        </div>
      </div>

      {showTaskPanel && selectedDate && (
        <>
          <div className={styles.overlay} onClick={() => setShowTaskPanel(false)} />
          <div className={styles.taskPanel}>
            <div className={styles.taskPanelHeader}>
              <h3>Tâches pour le {selectedDate.split('-')[2]} {monthNames[currentDate.getMonth()]}</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowTaskPanel(false)}
              >
                &times;
              </button>
            </div>
            
            <div className={styles.taskTypeButtons}>
              <button 
                className={`${styles.actionButton} ${styles.aiButton}`}
                onClick={() => {
                  setShowAITasks(true);
                  setShowTaskSelection(true);
                }}
              >
                <FiCpu /> IA ({aiTasksCount})
              </button>
              
              <button 
                className={`${styles.actionButton} ${styles.urgentButton}`}
                onClick={() => {
                  setShowUrgentTasks(true);
                  setShowTaskSelection(true);
                }}
              >
                <FiAlertTriangle /> Urgentes ({urgentTasksCount})
              </button>
            </div>

            <div className={styles.addTaskForm}>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Nouvelle tâche"
                className={styles.taskInput}
              />
              <button 
                onClick={addTask}
                className={styles.addButton}
              >
                <FiPlus />
              </button>
            </div>

            <div className={styles.tasksList}>
              {getTasksForDate(parseInt(selectedDate.split('-')[2])).length === 0 ? (
                <p className={styles.noTasks}>Aucune tâche pour ce jour</p>
              ) : (
                <ul>
                  {getTasksForDate(parseInt(selectedDate.split('-')[2])).map(task => (
                    <li 
                      key={task.id} 
                      className={`${styles.taskItem} ${task.statut === 'Terminé' ? styles.completed : ''}`}
                    >
                      {editTaskId === task.id ? (
                        <input
                          type="text"
                          value={editTaskText}
                          onChange={(e) => setEditTaskText(e.target.value)}
                          onBlur={saveEditedTask}
                          autoFocus
                          className={styles.editInput}
                        />
                      ) : (
                        <>
                          <label className={styles.taskCheckbox}>
                            <input
                              type="checkbox"
                              checked={task.statut === 'Terminé'}
                              onChange={() => toggleTaskCompletion(task.id)}
                            />
                            <span>{task.description}</span>
                            {task.isAI && <span className={styles.aiBadge}>IA</span>}
                          </label>
                          <div className={styles.taskButtons}>
                            <button 
                              className={styles.editButton}
                              onClick={() => startEditTask(task)}
                              title="Modifier"
                            >
                              <FiEdit />
                            </button>
                            <button 
                              className={styles.deleteButton}
                              onClick={() => deleteTask(task.id)}
                              title="Supprimer"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}

      {showTaskSelection && (
        <div className={styles.taskSelectionModal}>
          <div className={styles.taskSelectionContent}>
            <h3>
              {showAITasks ? 'Sélectionnez les tâches IA' : 'Sélectionnez les tâches urgentes'}
            </h3>
            
            <ul className={styles.taskSelectionList}>
              {showAITasks ? (
                selectedAITasks.map(task => (
                  <li key={task.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedAITasks.some(t => t.id === task.id)}
                        onChange={() => toggleAITaskSelection(task)}
                      />
                      {task.description}
                    </label>
                  </li>
                ))
              ) : (
                selectedUrgentTasks.map(task => (
                  <li key={task.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedUrgentTasks.some(t => t.id === task.id)}
                        onChange={() => toggleUrgentTaskSelection(task)}
                      />
                      {task.description}
                    </label>
                  </li>
                ))
              )}
            </ul>
            
            <div className={styles.selectionActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowTaskSelection(false)}
              >
                Annuler
              </button>
              
              <button 
                className={styles.confirmButton}
                onClick={() => 
                  showAITasks 
                    ? addSelectedTasks(selectedAITasks)
                    : addSelectedTasks(selectedUrgentTasks)
                }
                disabled={
                  showAITasks 
                    ? selectedAITasks.length === 0
                    : selectedUrgentTasks.length === 0
                }
              >
                <FiPlus /> Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceCalendar;