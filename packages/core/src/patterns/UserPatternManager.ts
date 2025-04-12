import { produce } from 'immer';
import type { UserPattern, TimeBlock, BlockType } from '../types';
import type { StorageAdapter } from '../storage/types';

export interface ProductivityMetrics {
  averageFocusDuration: number;
  averageBreakDuration: number;
  mostProductiveHours: { hour: number; productivity: number }[];
  mostProductiveDays: { day: number; productivity: number }[];
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

export class UserPatternManager {
  private currentPattern: UserPattern | null = null;
  private patternHistory: Record<string, UserPattern> = {};
  private readonly STORAGE_KEY = 'userPattern';
  private readonly HISTORY_KEY = 'patternHistory';
  private readonly DEFAULT_ANALYSIS_DAYS = 30;

  constructor(private storage: StorageAdapter) {
    this.loadFromStorage().catch(console.error);
  }

  private async loadFromStorage(): Promise<void> {
    try {
      this.currentPattern = await this.storage.get('userPattern');
      const history = await this.storage.get('patternHistory') ?? {};
      this.patternHistory = history;
    } catch (error) {
      console.error('Failed to load user patterns:', error);
    }
  }

  private async saveToStorage(): Promise<void> {
    try {
      await this.storage.set('userPattern', this.currentPattern);
      await this.storage.set('patternHistory', this.patternHistory);
    } catch (error) {
      console.error('Failed to save user patterns:', error);
    }
  }

  async getPattern(): Promise<UserPattern | null> {
    return this.currentPattern;
  }

  async updatePattern(updates: Partial<UserPattern>): Promise<UserPattern> {
    if (!this.currentPattern) {
      throw new Error('No pattern exists. Create a new pattern first.');
    }

    const updatedPattern = produce(this.currentPattern, (draft: UserPattern) => {
      Object.assign(draft, updates);
    });

    await this.saveToStorage();
    this.currentPattern = updatedPattern;
    return updatedPattern;
  }

  async createPattern(pattern: UserPattern): Promise<UserPattern> {
    await this.saveToStorage();
    this.currentPattern = pattern;
    return pattern;
  }

  async analyzeProductivity(blocks: TimeBlock[], days: number = this.DEFAULT_ANALYSIS_DAYS): Promise<ProductivityMetrics> {
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    const relevantBlocks = blocks.filter(block => block.startTime >= startDate);
    const focusBlocks = relevantBlocks.filter(block => block.type === 'FOCUS');
    const breakBlocks = relevantBlocks.filter(block => block.type === 'BREAK');
    const taskBlocks = relevantBlocks.filter(block => block.type === 'TASK');

    // Calculate average durations
    const averageFocusDuration = this.calculateAverageDuration(focusBlocks);
    const averageBreakDuration = this.calculateAverageDuration(breakBlocks);

    // Analyze productivity by hour
    const hourlyProductivity = this.analyzeHourlyProductivity(focusBlocks, taskBlocks);
    const mostProductiveHours = this.getTopPeriods(hourlyProductivity, 5);

    // Analyze productivity by day
    const dailyProductivity = this.analyzeDailyProductivity(focusBlocks, taskBlocks);
    const mostProductiveDays = this.getTopPeriods(dailyProductivity, 3).map(({ hour, productivity }) => ({
      day: hour,
      productivity,
    }));

    // Calculate task completion rate
    const completedTasks = taskBlocks.filter(block => block.type === 'TASK').length;
    const taskCompletionRate = completedTasks / taskBlocks.length || 0;

    // Calculate break adherence
    const breakAdherence = this.calculateBreakAdherence(focusBlocks, breakBlocks);

    return {
      averageFocusDuration,
      averageBreakDuration,
      mostProductiveHours,
      mostProductiveDays,
      taskCompletionRate,
      breakAdherence,
    };
  }

  async suggestPatternUpdates(blocks: TimeBlock[]): Promise<PatternAnalysis> {
    const metrics = await this.analyzeProductivity(blocks);
    
    // Suggest focus duration based on most successful periods
    const suggestedFocusDuration = Math.round(metrics.averageFocusDuration);
    
    // Suggest break duration based on historical data
    const suggestedBreakDuration = Math.round(metrics.averageBreakDuration);

    // Suggest productive periods based on hourly analysis
    const suggestedProductivePeriods = metrics.mostProductiveHours.flatMap(hour => 
      metrics.mostProductiveDays.map(day => ({
        dayOfWeek: day.day,
        startHour: hour.hour,
        endHour: hour.hour + 2, // Suggest 2-hour blocks
        confidence: (day.productivity + hour.productivity) / 2,
      }))
    ).sort((a, b) => b.confidence - a.confidence);

    return {
      suggestedFocusDuration,
      suggestedBreakDuration,
      suggestedProductivePeriods,
    };
  }

  private calculateAverageDuration(blocks: TimeBlock[]): number {
    if (blocks.length === 0) return 0;
    
    const durations = blocks.map(block => 
      (block.endTime.getTime() - block.startTime.getTime()) / (1000 * 60)
    );
    
    return durations.reduce((sum, duration) => sum + duration, 0) / blocks.length;
  }

  private analyzeHourlyProductivity(focusBlocks: TimeBlock[], taskBlocks: TimeBlock[]): Map<number, number> {
    const hourlyProductivity = new Map<number, number>();
    
    // Initialize hours
    for (let i = 0; i < 24; i++) {
      hourlyProductivity.set(i, 0);
    }

    // Analyze focus blocks
    for (const block of focusBlocks) {
      const hour = block.startTime.getHours();
      const duration = (block.endTime.getTime() - block.startTime.getTime()) / (1000 * 60);
      hourlyProductivity.set(hour, (hourlyProductivity.get(hour) || 0) + duration);
    }

    // Weight task blocks more heavily
    for (const block of taskBlocks) {
      const hour = block.startTime.getHours();
      const duration = (block.endTime.getTime() - block.startTime.getTime()) / (1000 * 60);
      hourlyProductivity.set(hour, (hourlyProductivity.get(hour) || 0) + duration * 1.5);
    }

    return hourlyProductivity;
  }

  private analyzeDailyProductivity(focusBlocks: TimeBlock[], taskBlocks: TimeBlock[]): Map<number, number> {
    const dailyProductivity = new Map<number, number>();
    
    // Initialize days
    for (let i = 0; i < 7; i++) {
      dailyProductivity.set(i, 0);
    }

    // Analyze focus blocks
    for (const block of focusBlocks) {
      const day = block.startTime.getDay();
      const duration = (block.endTime.getTime() - block.startTime.getTime()) / (1000 * 60);
      dailyProductivity.set(day, (dailyProductivity.get(day) || 0) + duration);
    }

    // Weight task blocks more heavily
    for (const block of taskBlocks) {
      const day = block.startTime.getDay();
      const duration = (block.endTime.getTime() - block.startTime.getTime()) / (1000 * 60);
      dailyProductivity.set(day, (dailyProductivity.get(day) || 0) + duration * 1.5);
    }

    return dailyProductivity;
  }

  private getTopPeriods(
    productivityMap: Map<number, number>,
    count: number
  ): { hour: number; productivity: number }[] {
    return Array.from(productivityMap.entries())
      .map(([period, productivity]) => ({ hour: period, productivity }))
      .sort((a, b) => b.productivity - a.productivity)
      .slice(0, count);
  }

  private calculateBreakAdherence(focusBlocks: TimeBlock[], breakBlocks: TimeBlock[]): number {
    if (!this.currentPattern || focusBlocks.length === 0) return 0;

    const expectedBreaks = Math.floor(
      focusBlocks.reduce(
        (total, block) => 
          total + (block.endTime.getTime() - block.startTime.getTime()) / (1000 * 60),
        0
      ) / this.currentPattern.preferredFocusDuration
    );

    return Math.min(breakBlocks.length / expectedBreaks, 1);
  }

  async getPatternHistory(days: number = this.DEFAULT_ANALYSIS_DAYS): Promise<UserPattern[]> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    return Object.entries(this.patternHistory)
      .filter(([timestamp]) => new Date(timestamp) >= cutoffDate)
      .map(([, pattern]) => pattern);
  }
} 