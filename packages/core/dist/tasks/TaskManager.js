import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import { TaskSchema } from './types';
export class TaskManager {
    constructor(storage) {
        this.STORAGE_KEY = 'tasks';
        this.tasks = new Map();
        this.storage = storage || null;
        if (this.storage) {
            this.loadFromStorage().catch(console.error);
        }
    }
    async loadFromStorage() {
        if (!this.storage)
            return;
        const storedTasks = await this.storage.get(this.STORAGE_KEY) || [];
        this.tasks = new Map(storedTasks.map(task => [task.id, task]));
    }
    async saveToStorage() {
        if (!this.storage)
            return;
        const tasks = Array.from(this.tasks.values());
        await this.storage.set(this.STORAGE_KEY, tasks);
    }
    async createTask(title, description, priority = 'medium', dueDate, parentId) {
        const task = {
            id: uuidv4(),
            title,
            description,
            priority,
            status: 'todo',
            dueDate,
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: [],
            parentId,
            subTasks: [],
        };
        // Validate task with zod schema
        TaskSchema.parse(task);
        // If this is a subtask, update the parent
        if (parentId) {
            const parent = this.tasks.get(parentId);
            if (parent) {
                this.tasks.set(parentId, produce(parent, (draft) => {
                    draft.subTasks = draft.subTasks || [];
                    draft.subTasks.push(task.id);
                }));
            }
        }
        this.tasks.set(task.id, task);
        await this.saveToStorage();
        return task;
    }
    async getTask(id) {
        return this.tasks.get(id);
    }
    async updateTask(id, updates) {
        const task = this.tasks.get(id);
        if (!task) {
            throw new Error(`Task with id ${id} not found`);
        }
        const updatedTask = produce(task, (draft) => {
            Object.assign(draft, updates);
            draft.updatedAt = new Date();
        });
        // Validate updated task
        TaskSchema.parse(updatedTask);
        this.tasks.set(id, updatedTask);
        await this.saveToStorage();
        return updatedTask;
    }
    async updateTaskStatus(id, status) {
        return this.updateTask(id, { status });
    }
    async deleteTask(id) {
        const task = this.tasks.get(id);
        if (!task) {
            return;
        }
        // If this task has a parent, remove it from parent's subtasks
        if (task.parentId) {
            const parent = this.tasks.get(task.parentId);
            if (parent?.subTasks) {
                this.tasks.set(task.parentId, produce(parent, (draft) => {
                    draft.subTasks = draft.subTasks?.filter((subtaskId) => subtaskId !== id);
                }));
            }
        }
        // Helper function to recursively delete tasks without saving
        const deleteTaskRecursive = (taskId) => {
            const taskToDelete = this.tasks.get(taskId);
            if (!taskToDelete)
                return;
            // Recursively delete all subtasks
            for (const subtaskId of taskToDelete.subTasks ?? []) {
                deleteTaskRecursive(subtaskId);
            }
            this.tasks.delete(taskId);
        };
        // Delete the task and all its subtasks
        deleteTaskRecursive(id);
        // Save the final state once
        await this.saveToStorage();
    }
    async getAllTasks() {
        return Array.from(this.tasks.values());
    }
    async getTasksByStatus(status) {
        return (await this.getAllTasks()).filter((task) => task.status === status);
    }
    async getTasksByPriority(priority) {
        return (await this.getAllTasks()).filter((task) => task.priority === priority);
    }
}
//# sourceMappingURL=TaskManager.js.map