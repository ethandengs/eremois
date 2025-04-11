import type { TimeBlock, UserPattern } from '../types';
import type { Task } from '../tasks/types';
import { TimelineManager } from './TimelineManager';
import type { TaskManager } from '../tasks/TaskManager';
import type { StorageAdapter } from '../storage/types';
export declare class TimelineService {
    private timelineManager;
    private taskManager;
    private userPattern;
    constructor(storage: StorageAdapter, taskManager: TaskManager);
    setUserPattern(pattern: UserPattern): Promise<void>;
    scheduleTask(task: Task, preferredStartTime?: Date): Promise<TimeBlock>;
    private findNextAvailableSlot;
    private findGapInBlocks;
    private getMinutesBetween;
    private estimateTaskDuration;
    suggestBreaks(start: Date, end: Date): Promise<TimeBlock[]>;
    getTimelineManager(): Promise<TimelineManager>;
}
//# sourceMappingURL=TimelineService.d.ts.map