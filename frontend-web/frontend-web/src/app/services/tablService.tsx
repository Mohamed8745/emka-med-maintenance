import { Machine, Schedule, Task } from '../types';

// Mock data - في الواقع الفعلي ستكون هذه استدعاءات API
const mockMachines: Machine[] = [
    { id: 1, name: 'Machine 1', type: 'Type A' },
    { id: 2, name: 'Machine 2', type: 'Type B' },
    // ... المزيد من الآلات
];

const mockSchedule: Schedule[] = [
    { id: 1, machineId: 1, date: '2023-06-15', time: '08:00', technician: 'John Doe', status: 'scheduled', notes: 'Regular maintenance' },
    // ... المزيد من المواعيد
];

let mockTasks: Task[] = [
    { id: 1, machineId: 1, task: 'Check oil level', priority: 'medium', addedDate: '2023-06-15', completed: false },
    // ... المزيد من المهام
];

export default {
    getMachines: async (): Promise<Machine[]> => {
        return new Promise(resolve => setTimeout(() => resolve(mockMachines), 500));
    },

    getMaintenanceSchedule: async (): Promise<Schedule[]> => {
        return new Promise(resolve => setTimeout(() => resolve(mockSchedule), 500));
    },

    getTasks: async (): Promise<Task[]> => {
        return new Promise(resolve => setTimeout(() => resolve(mockTasks), 500));
    },

    addTask: async (task: Omit<Task, 'id'>): Promise<Task> => {
        return new Promise(resolve => {
            const newTask = {
                id: Math.max(0, ...mockTasks.map(t => t.id)) + 1,
                ...task
            };
            mockTasks.push(newTask);
            setTimeout(() => resolve(newTask), 300);
        });
    },

    updateTask: async (id: number, task: Task): Promise<Task> => {
        return new Promise(resolve => {
            mockTasks = mockTasks.map(t => t.id === id ? task : t);
            setTimeout(() => resolve(task), 300);
        });
    },

    deleteTask: async (id: number): Promise<boolean> => {
        return new Promise(resolve => {
            mockTasks = mockTasks.filter(t => t.id !== id);
            setTimeout(() => resolve(true), 300);
        });
    }
};