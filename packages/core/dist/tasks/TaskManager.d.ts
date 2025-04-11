import type { Task, TaskStatus, TaskPriority } from './types';
import type { StorageAdapter } from '../storage/types';
export declare class TaskManager {
    private tasks;
    private storage;
    private readonly STORAGE_KEY;
    constructor(storage?: StorageAdapter);
    private loadFromStorage;
    private saveToStorage;
    createTask(title: string, description?: string, priority?: TaskPriority, dueDate?: Date, parentId?: string): Promise<Task>;
    getTask(id: string): Promise<Task | undefined>;
    updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task>;
    updateTaskStatus(id: string, status: TaskStatus): Promise<Task>;
    deleteTask(id: string): Promise<void>;
    getAllTasks(): Promise<Task[]>;
    getTasksByStatus(status: TaskStatus): Promise<Task[]>;
    getTasksByPriority(priority: TaskPriority): Promise<Task[]>;
}
//# sourceMappingURL=TaskManager.d.ts.map