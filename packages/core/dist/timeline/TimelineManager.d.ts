import type { TimeBlock, BlockType } from '../types';
import type { StorageAdapter } from '../storage/types';
import type { Task } from '../tasks/types';
import type { TaskManager } from '../tasks/TaskManager';
export declare class TimelineManager {
    private blocks;
    private storage;
    private taskManager;
    private readonly STORAGE_KEY;
    constructor(storage?: StorageAdapter, taskManager?: TaskManager);
    private loadFromStorage;
    private saveToStorage;
    createBlock(type: BlockType, startTime: Date, endTime: Date, title?: string, description?: string, color?: string, taskId?: string): Promise<TimeBlock>;
    getBlock(id: string): Promise<TimeBlock | undefined>;
    updateBlock(id: string, updates: Partial<Omit<TimeBlock, 'id'>>): Promise<TimeBlock>;
    deleteBlock(id: string): Promise<void>;
    getBlocksInRange(start: Date, end: Date): Promise<TimeBlock[]>;
    private findOverlappingBlocks;
    createTaskBlock(task: Task, startTime: Date, endTime: Date): Promise<TimeBlock>;
    getAllBlocks(): Promise<TimeBlock[]>;
    getBlocksByType(type: BlockType): Promise<TimeBlock[]>;
}
//# sourceMappingURL=TimelineManager.d.ts.map