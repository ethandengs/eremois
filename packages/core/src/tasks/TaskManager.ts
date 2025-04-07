import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import type { Task, TaskStatus, TaskPriority } from './types';
import { TaskSchema } from './types';
import type { StorageAdapter } from '../storage/types';

export class TaskManager {
  private tasks: Map<string, Task>;
  private storage: StorageAdapter | null;
  private readonly STORAGE_KEY = 'tasks';

  constructor(storage?: StorageAdapter) {
    this.tasks = new Map();
    this.storage = storage || null;
    if (this.storage) {
      this.loadFromStorage().catch(console.error);
    }
  }

  private async loadFromStorage(): Promise<void> {
    if (!this.storage) return;

    const storedTasks = await this.storage.get<Task[]>(this.STORAGE_KEY) || [];
    this.tasks = new Map(storedTasks.map(task => [task.id, task]));
  }

  private async saveToStorage(): Promise<void> {
    if (!this.storage) return;

    const tasks = Array.from(this.tasks.values());
    await this.storage.set(this.STORAGE_KEY, tasks);
  }

  async createTask(
    title: string,
    description?: string,
    priority: TaskPriority = 'medium',
    dueDate?: Date,
    parentId?: string,
  ): Promise<Task> {
    const task: Task = {
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
        this.tasks.set(
          parentId,
          produce(parent, (draft: Task) => {
            draft.subTasks = draft.subTasks || [];
            draft.subTasks.push(task.id);
          }),
        );
      }
    }

    this.tasks.set(task.id, task);
    await this.saveToStorage();
    return task;
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    const updatedTask = produce(task, (draft: Task) => {
      Object.assign(draft, updates);
      draft.updatedAt = new Date();
    });

    // Validate updated task
    TaskSchema.parse(updatedTask);
    
    this.tasks.set(id, updatedTask);
    await this.saveToStorage();
    return updatedTask;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.updateTask(id, { status });
  }

  async deleteTask(id: string): Promise<void> {
    const task = this.tasks.get(id);
    if (!task) {
      return;
    }

    // If this task has a parent, remove it from parent's subtasks
    if (task.parentId) {
      const parent = this.tasks.get(task.parentId);
      if (parent?.subTasks) {
        this.tasks.set(
          task.parentId,
          produce(parent, (draft: Task) => {
            draft.subTasks = draft.subTasks?.filter((subtaskId: string) => subtaskId !== id);
          }),
        );
      }
    }

    // Helper function to recursively delete tasks without saving
    const deleteTaskRecursive = (taskId: string) => {
      const taskToDelete = this.tasks.get(taskId);
      if (!taskToDelete) return;

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

  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    return (await this.getAllTasks()).filter((task) => task.status === status);
  }

  async getTasksByPriority(priority: TaskPriority): Promise<Task[]> {
    return (await this.getAllTasks()).filter((task) => task.priority === priority);
  }
} 