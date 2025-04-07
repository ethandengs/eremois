import { TaskManager } from '../TaskManager';
import type { Task } from '../types';
import type { StorageAdapter } from '../../storage/types';

// Mock storage adapter
const mockStorage: StorageAdapter = {
  set: jest.fn().mockResolvedValue(undefined),
  get: jest.fn().mockResolvedValue([]),
  delete: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
  keys: jest.fn().mockResolvedValue([]),
  has: jest.fn().mockResolvedValue(false),
};

describe('TaskManager', () => {
  let taskManager: TaskManager;

  beforeEach(() => {
    jest.clearAllMocks();
    taskManager = new TaskManager(mockStorage);
  });

  describe('createTask', () => {
    it('should create a task with required fields', async () => {
      const task = await taskManager.createTask('Test Task');
      
      expect(task).toBeDefined();
      expect(task.title).toBe('Test Task');
      expect(task.status).toBe('todo');
      expect(task.priority).toBe('medium');
      expect(task.tags).toEqual([]);
      expect(task.subTasks).toEqual([]);
      expect(mockStorage.set).toHaveBeenCalledTimes(1);
    });

    it('should create a subtask and update parent', async () => {
      const parentTask = await taskManager.createTask('Parent Task');
      const subtask = await taskManager.createTask('Subtask', undefined, 'high', undefined, parentTask.id);

      const updatedParent = await taskManager.getTask(parentTask.id);
      expect(updatedParent?.subTasks).toContain(subtask.id);
      expect(subtask.parentId).toBe(parentTask.id);
      expect(mockStorage.set).toHaveBeenCalledTimes(2); // Initial create + subtask create (which includes parent update)
    });
  });

  describe('updateTask', () => {
    it('should update task fields', async () => {
      const task = await taskManager.createTask('Original Title');
      const updates = {
        title: 'Updated Title',
        description: 'New description',
        priority: 'high' as const,
      };

      const updatedTask = await taskManager.updateTask(task.id, updates);

      expect(updatedTask.title).toBe(updates.title);
      expect(updatedTask.description).toBe(updates.description);
      expect(updatedTask.priority).toBe(updates.priority);
      expect(mockStorage.set).toHaveBeenCalledTimes(2); // Create + update
    });

    it('should throw error for non-existent task', async () => {
      await expect(
        taskManager.updateTask('non-existent-id', { title: 'New Title' })
      ).rejects.toThrow();
    });
  });

  describe('deleteTask', () => {
    it('should delete task and its subtasks', async () => {
      // Reset the mock before this specific test
      jest.clearAllMocks();

      const parentTask = await taskManager.createTask('Parent');
      const subtask1 = await taskManager.createTask('Subtask 1', undefined, undefined, undefined, parentTask.id);
      const subtask2 = await taskManager.createTask('Subtask 2', undefined, undefined, undefined, parentTask.id);

      // Clear the mock counts from setup
      jest.clearAllMocks();

      // Perform the delete operation
      await taskManager.deleteTask(parentTask.id);

      expect(await taskManager.getTask(parentTask.id)).toBeUndefined();
      expect(await taskManager.getTask(subtask1.id)).toBeUndefined();
      expect(await taskManager.getTask(subtask2.id)).toBeUndefined();
      expect(mockStorage.set).toHaveBeenCalledTimes(1); // Only the final state update
    });
  });

  describe('query methods', () => {
    let tasks: Task[];

    beforeEach(async () => {
      tasks = [
        await taskManager.createTask('Task 1', undefined, 'high'),
        await taskManager.createTask('Task 2', undefined, 'medium'),
        await taskManager.createTask('Task 3', undefined, 'low'),
      ];

      await taskManager.updateTaskStatus(tasks[0].id, 'completed');
      await taskManager.updateTaskStatus(tasks[1].id, 'in_progress');
    });

    it('should get tasks by status', async () => {
      const completedTasks = await taskManager.getTasksByStatus('completed');
      const inProgressTasks = await taskManager.getTasksByStatus('in_progress');
      const todoTasks = await taskManager.getTasksByStatus('todo');

      expect(completedTasks).toHaveLength(1);
      expect(inProgressTasks).toHaveLength(1);
      expect(todoTasks).toHaveLength(1);
    });

    it('should get tasks by priority', async () => {
      const highPriorityTasks = await taskManager.getTasksByPriority('high');
      const mediumPriorityTasks = await taskManager.getTasksByPriority('medium');
      const lowPriorityTasks = await taskManager.getTasksByPriority('low');

      expect(highPriorityTasks).toHaveLength(1);
      expect(mediumPriorityTasks).toHaveLength(1);
      expect(lowPriorityTasks).toHaveLength(1);
    });
  });
}); 