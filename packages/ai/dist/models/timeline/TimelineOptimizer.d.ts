import type { BaseModel } from '../base/BaseModel';
import type { ModelMetadata, ModelConfig, TrainingConfig, InferenceConfig } from '../../types/model';
export interface TimelineData {
    tasks: Array<{
        id: string;
        duration: number;
        priority: number;
        dependencies: string[];
        preferredTime?: {
            start: number;
            end: number;
        };
    }>;
    constraints: {
        workingHours: {
            start: number;
            end: number;
        };
        breakDuration: number;
        maxTasksPerDay: number;
    };
}
export interface OptimizedTimeline {
    schedule: Array<{
        taskId: string;
        startTime: number;
        endTime: number;
        confidence: number;
    }>;
    metrics: {
        utilizationRate: number;
        satisfactionScore: number;
    };
}
export declare class TimelineOptimizer implements BaseModel<TimelineData, OptimizedTimeline> {
    readonly id = "timeline-optimizer-v1";
    readonly metadata: ModelMetadata;
    private _config;
    get config(): ModelConfig;
    initialize(config: ModelConfig): Promise<void>;
    predict(input: TimelineData, config?: InferenceConfig): Promise<OptimizedTimeline>;
    train(data: TimelineData[], config?: TrainingConfig): Promise<void>;
    export(): Promise<ArrayBuffer>;
    import(data: ArrayBuffer): Promise<void>;
    dispose(): Promise<void>;
}
//# sourceMappingURL=TimelineOptimizer.d.ts.map