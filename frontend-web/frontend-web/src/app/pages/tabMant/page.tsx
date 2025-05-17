"use client";

import React, { useState, useEffect } from 'react';
import styles from "./tabMant.module.css";
import maintenanceService from '../../services/maintenanceService';
import { Machine, Schedule, Task } from '../../types';
import { useTranslation } from 'next-i18next';
import Header from "../../components/header";
import SearchBar from "../../components/searchbar";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

const MaintenanceSchedule = () => {
  const { t } = useTranslation('common');
  const [showNewTasksModal, setShowNewTasksModal] = useState<boolean>(false);
  const [selectedMachine, setSelectedMachine] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [newTasks, setNewTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [machinesData, scheduleData, tasksData] = await Promise.all([
          maintenanceService.getMachines(),
          maintenanceService.getMaintenanceSchedule(),
          maintenanceService.getNewTasks()
        ]);

        setMachines(machinesData);
        setSchedule(scheduleData);
        setNewTasks(tasksData);
      } catch (error) {
        console.error(t('error.loading_data'), error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const getMachineName = (machineId: number): string => {
    const machine = machines.find(m => m.id === machineId);
    return machine ? machine.name : t('maintenance.unknown');
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case t('status.scheduled'): return styles.statusScheduled;
      case t('status.completed'): return styles.statusCompleted;
      case t('status.cancelled'): return styles.statusCancelled;
      default: return '';
    }
  };

  const getPriorityClass = (priority: string): string => {
    switch (priority) {
      case t('priority.high'): return styles.priorityHigh;
      case t('priority.medium'): return styles.priorityMedium;
      case t('priority.low'): return styles.priorityLow;
      default: return '';
    }
  };

  const filteredSchedule = selectedMachine
    ? schedule.filter(app => app.machineId === parseInt(selectedMachine))
    : schedule;

  const convertTaskToSchedule = async (taskId: number): Promise<void> => {
    const task = newTasks.find(t => t.id === taskId);
    if (!task) return;

    const newAppointment: Omit<Schedule, 'id'> = {
      machineId: task.machineId,
      date: new Date().toISOString().split('T')[0],
      time: '08:00',
      technician: '',
      status: t('status.scheduled')
    };

    try {
      const createdAppointment = await maintenanceService.addMaintenance(newAppointment);
      if (createdAppointment) {
        setSchedule([...schedule, createdAppointment]);
        await maintenanceService.deleteTask(taskId);
        setNewTasks(newTasks.filter(t => t.id !== taskId));
      }
    } catch (error) {
      console.error(t('error.converting_task'), error);
    }
  };

  const deleteNewTask = async (taskId: number): Promise<void> => {
    try {
      const success = await maintenanceService.deleteTask(taskId);
      if (success) {
        setNewTasks(newTasks.filter(t => t.id !== taskId));
      }
    } catch (error) {
      console.error(t('error.deleting_task'), error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>{t('maintenance.loading')}</div>;
  }

  return (
    <>
    <ProtectedRoute>
    <Header>
      <SearchBar onSearch={(query) => console.log("Recherche:", query)} />
    </Header>
    <div className={styles.container}>
      <div className={styles.maintenanceApp}>
        <div className={styles.header}>
          <h1>{t('maintenance.title')}</h1>
        </div>

        <main>
          <div className={styles.controls}>
            <select 
              value={selectedMachine} 
              onChange={(e) => setSelectedMachine(e.target.value)}
              className={styles.machineFilter}
            >
              <option value="">{t('maintenance.all_machines')}</option>
              {machines.map(machine => (
                <option key={machine.id} value={machine.id.toString()}>
                  {machine.name} - {machine.type}
                </option>
              ))}
            </select>

            <button 
              className={styles.newTasksBtn}
              onClick={() => setShowNewTasksModal(true)}
              disabled={newTasks.length === 0}
            >
              {t('maintenance.new_tasks')} ({newTasks.length})
            </button>
          </div>

          <div className={styles.scheduleTableContainer}>
            <h2>{t('maintenance.schedule')}</h2>
            {filteredSchedule.length === 0 ? (
              <p className={styles.noData}>{t('maintenance.no_appointments')}</p>
            ) : (
              <table className={styles.scheduleTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{t('maintenance.machine')}</th>
                    <th>{t('maintenance.date')}</th>
                    <th>{t('maintenance.time')}</th>
                    <th>{t('maintenance.technician')}</th>
                    <th>{t('maintenance.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedule.map((appointment, index) => (
                    <tr key={appointment.id}>
                      <td>{index + 1}</td>
                      <td>{getMachineName(appointment.machineId)}</td>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.technician || t('maintenance.not_assigned')}</td>
                      <td className={`${styles.status} ${getStatusClass(appointment.status)}`}>
                        {appointment.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>

        {showNewTasksModal && (
          <div className={styles.modalOverlay} onClick={() => setShowNewTasksModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>{t('maintenance.new_tasks')}</h3>
                <button 
                  className={styles.closeModal}
                  onClick={() => setShowNewTasksModal(false)}
                  aria-label={t('common.close')}
                >
                  ✕
                </button>
              </div>

              <div className={styles.tasksList}>
                {newTasks.length === 0 ? (
                  <p className={styles.noTasks}>{t('maintenance.no_tasks')}</p>
                ) : (
                  <table className={styles.tasksTable}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{t('maintenance.machine')}</th>
                        <th>{t('maintenance.task')}</th>
                        <th>{t('maintenance.priority')}</th>
                        <th>{t('maintenance.add_date')}</th>
                        <th>{t('maintenance.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newTasks.map((task, index) => (
                        <tr key={task.id}>
                          <td>{index + 1}</td>
                          <td>{getMachineName(task.machineId)}</td>
                          <td>{task.task}</td>
                          <td className={`${styles.priority} ${getPriorityClass(task.priority)}`}>
                            {task.priority}
                          </td>
                          <td>{task.addedDate}</td>
                          <td className={styles.actions}>
                            <button 
                              className={styles.convertBtn}
                              onClick={() => convertTaskToSchedule(task.id)}
                            >
                              {t('maintenance.convert')}
                            </button>
                            <button 
                              className={styles.deleteBtn}
                              onClick={() => deleteNewTask(task.id)}
                            >
                              {t('maintenance.delete')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
    </>
  );
};

export default MaintenanceSchedule;