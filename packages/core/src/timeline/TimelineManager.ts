import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import type { TimeBlock, BlockType } from '../types';
import type { StorageAdapter } from '../storage/types';
import type { Task } from '../tasks/types';
import type { TaskManager } from '../tasks/TaskManager';

export class TimelineManager {
  private blocks: Map<string, TimeBlock> = new Map();
  private readonly STORAGE_KEY = 'timeBlocks';

  constructor(
    private readonly storage: StorageAdapter,
    private readonly taskManager?: TaskManager
  ) {
    this.loadFromStorage().catch(console.error);
  }

  private async loadFromStorage(): Promise<void> {
    try {
      const storedBlocks = await this.storage.get('timeBlocks') ?? [];
      this.blocks = new Map(storedBlocks.map(block => [block.id, block]));
    } catch (error) {
      console.error('Failed to load time blocks:', error);
    }
  }

  private async saveToStorage(): Promise<void> {
    try {
      const blocks = Array.from(this.blocks.values());
      await this.storage.set('timeBlocks', blocks);
    } catch (error) {
      console.error('Failed to save time blocks:', error);
    }
  }

  async createBlock(
    type: BlockType,
    startTime: Date,
    endTime: Date,
    title?: string,
    description?: string,
    color?: string,
    taskId?: string,
  ): Promise<TimeBlock> {
    // Validate time range
    if (startTime >= endTime) {
      throw new Error('Start time must be before end time');
    }

    // Check for overlapping blocks
    const overlapping = await this.findOverlappingBlocks(startTime, endTime);
    if (overlapping.length > 0) {
      throw new Error('Time block overlaps with existing blocks');
    }

    // If taskId is provided, verify the task exists
    if (taskId && this.taskManager) {
      const task = await this.taskManager.getTask(taskId);
      if (!task) {
        throw new Error(`Task with id ${taskId} not found`);
      }
    }

    const block: TimeBlock = {
      id: uuidv4(),
      type,
      startTime,
      endTime,
      title,
      description,
      color,
      updatedAt: new Date(),
    };

    this.blocks.set(block.id, block);
    await this.saveToStorage();
    return block;
  }

  async getBlock(id: string): Promise<TimeBlock | undefined> {
    return this.blocks.get(id);
  }

  async updateBlock(
    id: string,
    updates: Partial<Omit<TimeBlock, 'id' | 'updatedAt'>>,
  ): Promise<TimeBlock> {
    const block = this.blocks.get(id);
    if (!block) {
      throw new Error(`Block with id ${id} not found`);
    }

    // If updating times, validate no overlaps
    if (updates.startTime || updates.endTime) {
      const startTime = updates.startTime || block.startTime;
      const endTime = updates.endTime || block.endTime;
      
      if (startTime >= endTime) {
        throw new Error('Start time must be before end time');
      }

      const overlapping = await this.findOverlappingBlocks(startTime, endTime, id);
      if (overlapping.length > 0) {
        throw new Error('Updated time block would overlap with existing blocks');
      }
    }

    const updatedBlock = produce(block, (draft: TimeBlock) => {
      Object.assign(draft, updates);
      draft.updatedAt = new Date();
    });

    this.blocks.set(id, updatedBlock);
    await this.saveToStorage();
    return updatedBlock;
  }

  async deleteBlock(id: string): Promise<void> {
    this.blocks.delete(id);
    await this.saveToStorage();
  }

  async getBlocksInRange(start: Date, end: Date): Promise<TimeBlock[]> {
    return Array.from(this.blocks.values()).filter(block => 
      block.startTime >= start && block.endTime <= end
    );
  }

  private async findOverlappingBlocks(
    start: Date,
    end: Date,
    excludeId?: string,
  ): Promise<TimeBlock[]> {
    return Array.from(this.blocks.values()).filter(block => 
      block.id !== excludeId && // Exclude the block being updated
      !( // Return true if blocks overlap
        block.endTime <= start || // Block ends before start
        block.startTime >= end    // Block starts after end
      )
    );
  }

  async createTaskBlock(
    task: Task,
    startTime: Date,
    endTime: Date,
  ): Promise<TimeBlock> {
    return this.createBlock(
      'TASK',
      startTime,
      endTime,
      task.title,
      task.description,
      undefined, // color could be based on task priority
      task.id,
    );
  }

  async getAllBlocks(): Promise<TimeBlock[]> {
    return Array.from(this.blocks.values());
  }

  async getBlocksByType(type: BlockType): Promise<TimeBlock[]> {
    return Array.from(this.blocks.values()).filter(block => block.type === type);
  }
} 