import { produce } from 'immer';
export class UserPatternManager {
    constructor(storage) {
        this.pattern = null;
        this.STORAGE_KEY = 'userPattern';
        this.HISTORY_KEY = 'patternHistory';
        this.DEFAULT_ANALYSIS_DAYS = 30;
        this.storage = storage;
        this.loadPattern().catch(console.error);
    }
    async loadPattern() {
        this.pattern = await this.storage.get(this.STORAGE_KEY) || null;
    }
    async savePattern(pattern) {
        await this.storage.set(this.STORAGE_KEY, pattern);
        // Save to history for trend analysis
        const timestamp = new Date().toISOString();
        const history = await this.storage.get(this.HISTORY_KEY) || {};
        history[timestamp] = pattern;
        await this.storage.set(this.HISTORY_KEY, history);
    }
    async getPattern() {
        return this.pattern;
    }
    async updatePattern(updates) {
        if (!this.pattern) {
            throw new Error('No pattern exists. Create a new pattern first.');
        }
        const updatedPattern = produce(this.pattern, (draft) => {
            Object.assign(draft, updates);
        });
        await this.savePattern(updatedPattern);
        this.pattern = updatedPattern;
        return updatedPattern;
    }
    async createPattern(pattern) {
        await this.savePattern(pattern);
        this.pattern = pattern;
        return pattern;
    }
    async analyzeProductivity(blocks, days = this.DEFAULT_ANALYSIS_DAYS) {
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
    async suggestPatternUpdates(blocks) {
        const metrics = await this.analyzeProductivity(blocks);
        // Suggest focus duration based on most successful periods
        const suggestedFocusDuration = Math.round(metrics.averageFocusDuration);
        // Suggest break duration based on historical data
        const suggestedBreakDuration = Math.round(metrics.averageBreakDuration);
        // Suggest productive periods based on hourly analysis
        const suggestedProductivePeriods = metrics.mostProductiveHours.flatMap(hour => metrics.mostProductiveDays.map(day => ({
            dayOfWeek: day.day,
            startHour: hour.hour,
            endHour: hour.hour + 2, // Suggest 2-hour blocks
            confidence: (day.productivity + hour.productivity) / 2,
        }))).sort((a, b) => b.confidence - a.confidence);
        return {
            suggestedFocusDuration,
            suggestedBreakDuration,
            suggestedProductivePeriods,
        };
    }
    calculateAverageDuration(blocks) {
        if (blocks.length === 0)
            return 0;
        const durations = blocks.map(block => (block.endTime.getTime() - block.startTime.getTime()) / (1000 * 60));
        return durations.reduce((sum, duration) => sum + duration, 0) / blocks.length;
    }
    analyzeHourlyProductivity(focusBlocks, taskBlocks) {
        const hourlyProductivity = new Map();
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
    analyzeDailyProductivity(focusBlocks, taskBlocks) {
        const dailyProductivity = new Map();
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
    getTopPeriods(productivityMap, count) {
        return Array.from(productivityMap.entries())
            .map(([period, productivity]) => ({ hour: period, productivity }))
            .sort((a, b) => b.productivity - a.productivity)
            .slice(0, count);
    }
    calculateBreakAdherence(focusBlocks, breakBlocks) {
        if (!this.pattern || focusBlocks.length === 0)
            return 0;
        const expectedBreaks = Math.floor(focusBlocks.reduce((total, block) => total + (block.endTime.getTime() - block.startTime.getTime()) / (1000 * 60), 0) / this.pattern.preferredFocusDuration);
        return Math.min(breakBlocks.length / expectedBreaks, 1);
    }
    async getPatternHistory(days = this.DEFAULT_ANALYSIS_DAYS) {
        const history = await this.storage.get(this.HISTORY_KEY) || {};
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        return Object.entries(history)
            .filter(([timestamp]) => new Date(timestamp) >= cutoffDate)
            .map(([, pattern]) => pattern);
    }
}
//# sourceMappingURL=UserPatternManager.js.map