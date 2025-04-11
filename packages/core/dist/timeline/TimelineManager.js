import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
export class TimelineManager {
    constructor(storage, taskManager) {
        this.STORAGE_KEY = 'timeBlocks';
        this.blocks = new Map();
        this.storage = storage || null;
        this.taskManager = taskManager || null;
        if (this.storage) {
            this.loadFromStorage().catch(console.error);
        }
    }
    async loadFromStorage() {
        if (!this.storage)
            return;
        const storedBlocks = await this.storage.get(this.STORAGE_KEY) || [];
        this.blocks = new Map(storedBlocks.map(block => [block.id, block]));
    }
    async saveToStorage() {
        if (!this.storage)
            return;
        const blocks = Array.from(this.blocks.values());
        await this.storage.set(this.STORAGE_KEY, blocks);
    }
    async createBlock(type, startTime, endTime, title, description, color, taskId) {
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
        const block = {
            id: uuidv4(),
            type,
            startTime,
            endTime,
            title,
            description,
            color,
        };
        this.blocks.set(block.id, block);
        await this.saveToStorage();
        return block;
    }
    async getBlock(id) {
        return this.blocks.get(id);
    }
    async updateBlock(id, updates) {
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
        const updatedBlock = produce(block, (draft) => {
            Object.assign(draft, updates);
        });
        this.blocks.set(id, updatedBlock);
        await this.saveToStorage();
        return updatedBlock;
    }
    async deleteBlock(id) {
        this.blocks.delete(id);
        await this.saveToStorage();
    }
    async getBlocksInRange(start, end) {
        return Array.from(this.blocks.values()).filter(block => block.startTime >= start && block.endTime <= end);
    }
    async findOverlappingBlocks(start, end, excludeId) {
        return Array.from(this.blocks.values()).filter(block => block.id !== excludeId && // Exclude the block being updated
            !( // Return true if blocks overlap
            block.endTime <= start || // Block ends before start
                block.startTime >= end // Block starts after end
            ));
    }
    async createTaskBlock(task, startTime, endTime) {
        return this.createBlock('TASK', startTime, endTime, task.title, task.description, undefined, // color could be based on task priority
        task.id);
    }
    async getAllBlocks() {
        return Array.from(this.blocks.values());
    }
    async getBlocksByType(type) {
        return Array.from(this.blocks.values()).filter(block => block.type === type);
    }
}
//# sourceMappingURL=TimelineManager.js.map