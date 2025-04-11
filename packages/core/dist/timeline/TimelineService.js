import { TimelineManager } from './TimelineManager';
export class TimelineService {
    constructor(storage, taskManager) {
        this.userPattern = null;
        this.timelineManager = new TimelineManager(storage, taskManager);
        this.taskManager = taskManager;
    }
    async setUserPattern(pattern) {
        this.userPattern = pattern;
    }
    async scheduleTask(task, preferredStartTime) {
        if (!this.userPattern) {
            throw new Error('User pattern not set');
        }
        const startTime = preferredStartTime || await this.findNextAvailableSlot(task);
        const duration = this.estimateTaskDuration(task);
        const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
        return this.timelineManager.createTaskBlock(task, startTime, endTime);
    }
    async findNextAvailableSlot(task) {
        if (!this.userPattern) {
            throw new Error('User pattern not set');
        }
        const now = new Date();
        const duration = this.estimateTaskDuration(task);
        let candidateTime = now;
        // Look for slots in the next 7 days
        for (let day = 0; day < 7; day++) {
            const dayOfWeek = candidateTime.getDay();
            // Check if this is a preferred day for the task type
            const productivePeriod = this.userPattern.productivePeriods.find(period => period.dayOfWeek === dayOfWeek);
            if (productivePeriod) {
                // Try to find a slot within the productive period
                const periodStart = new Date(candidateTime);
                periodStart.setHours(productivePeriod.startHour, 0, 0, 0);
                const periodEnd = new Date(candidateTime);
                periodEnd.setHours(productivePeriod.endHour, 0, 0, 0);
                // If we're past the start time for today, start from now
                const startTime = candidateTime > periodStart ? candidateTime : periodStart;
                // Look for available slots in this period
                const blocks = await this.timelineManager.getBlocksInRange(startTime, periodEnd);
                const availableSlot = this.findGapInBlocks(blocks, startTime, periodEnd, duration);
                if (availableSlot) {
                    return availableSlot;
                }
            }
            // Move to next day
            candidateTime = new Date(candidateTime.getTime() + 24 * 60 * 60 * 1000);
            candidateTime.setHours(0, 0, 0, 0);
        }
        throw new Error('No available time slots found in the next 7 days');
    }
    findGapInBlocks(blocks, start, end, durationMinutes) {
        // Sort blocks by start time
        const sortedBlocks = [...blocks].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
        let currentTime = start;
        // Check gap before first block
        if (sortedBlocks.length === 0 ||
            this.getMinutesBetween(currentTime, sortedBlocks[0].startTime) >= durationMinutes) {
            return currentTime;
        }
        // Check gaps between blocks
        for (let i = 0; i < sortedBlocks.length - 1; i++) {
            currentTime = sortedBlocks[i].endTime;
            const nextStart = sortedBlocks[i + 1].startTime;
            if (this.getMinutesBetween(currentTime, nextStart) >= durationMinutes) {
                return currentTime;
            }
        }
        // Check gap after last block
        if (sortedBlocks.length > 0) {
            currentTime = sortedBlocks[sortedBlocks.length - 1].endTime;
            if (this.getMinutesBetween(currentTime, end) >= durationMinutes) {
                return currentTime;
            }
        }
        return null;
    }
    getMinutesBetween(start, end) {
        return (end.getTime() - start.getTime()) / (1000 * 60);
    }
    estimateTaskDuration(task) {
        // This is a simple implementation that could be enhanced with ML-based estimation
        switch (task.priority) {
            case 'urgent':
                return 30;
            case 'high':
                return 45;
            case 'medium':
                return 60;
            case 'low':
                return 90;
            default:
                return 60;
        }
    }
    async suggestBreaks(start, end) {
        if (!this.userPattern) {
            throw new Error('User pattern not set');
        }
        const blocks = await this.timelineManager.getBlocksInRange(start, end);
        const suggestedBreaks = [];
        const breakDuration = this.userPattern.preferredBreakDuration;
        let currentTime = start;
        while (currentTime < end) {
            const nextBlock = blocks.find(block => block.startTime > currentTime);
            if (!nextBlock) {
                break;
            }
            const gap = this.getMinutesBetween(currentTime, nextBlock.startTime);
            if (gap >= breakDuration) {
                // Suggest a break in the middle of the gap
                const breakStart = new Date(currentTime.getTime() + (gap - breakDuration) / 2 * 60 * 1000);
                const breakEnd = new Date(breakStart.getTime() + breakDuration * 60 * 1000);
                const breakBlock = await this.timelineManager.createBlock('BREAK', breakStart, breakEnd, 'Suggested Break');
                suggestedBreaks.push(breakBlock);
            }
            currentTime = nextBlock.endTime;
        }
        return suggestedBreaks;
    }
    async getTimelineManager() {
        return this.timelineManager;
    }
}
//# sourceMappingURL=TimelineService.js.map