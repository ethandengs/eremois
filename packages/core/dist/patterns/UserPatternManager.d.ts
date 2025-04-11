import type { UserPattern, TimeBlock } from '../types';
import type { StorageAdapter } from '../storage/types';
export interface ProductivityMetrics {
    averageFocusDuration: number;
    averageBreakDuration: number;
    mostProductiveHours: {
        hour: number;
        productivity: number;
    }[];
    mostProductiveDays: {
        day: number;
        productivity: number;
    }[];
    taskCompletionRate: number;
    breakAdherence: number;
}
export interface PatternAnalysis {
    suggestedFocusDuration: number;
    suggestedBreakDuration: number;
    suggestedProductivePeriods: {
        dayOfWeek: number;
        startHour: number;
        endHour: number;
        confidence: number;
    }[];
}
export declare class UserPatternManager {
    private pattern;
    private storage;
    private readonly STORAGE_KEY;
    private readonly HISTORY_KEY;
    private readonly DEFAULT_ANALYSIS_DAYS;
    constructor(storage: StorageAdapter);
    private loadPattern;
    private savePattern;
    getPattern(): Promise<UserPattern | null>;
    updatePattern(updates: Partial<UserPattern>): Promise<UserPattern>;
    createPattern(pattern: UserPattern): Promise<UserPattern>;
    analyzeProductivity(blocks: TimeBlock[], days?: number): Promise<ProductivityMetrics>;
    suggestPatternUpdates(blocks: TimeBlock[]): Promise<PatternAnalysis>;
    private calculateAverageDuration;
    private analyzeHourlyProductivity;
    private analyzeDailyProductivity;
    private getTopPeriods;
    private calculateBreakAdherence;
    getPatternHistory(days?: number): Promise<UserPattern[]>;
}
//# sourceMappingURL=UserPatternManager.d.ts.map