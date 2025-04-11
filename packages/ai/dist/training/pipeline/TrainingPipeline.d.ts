import type { BaseModel } from '../../models/base/BaseModel';
import type { TrainingConfig } from '../../types/model';
export interface TrainingMetrics {
    loss: number;
    accuracy: number;
    epochTime: number;
    memoryUsage: number;
}
export interface TrainingCallback {
    onEpochStart?: (epoch: number) => void;
    onEpochEnd?: (epoch: number, metrics: TrainingMetrics) => void;
    onBatchEnd?: (batch: number, metrics: TrainingMetrics) => void;
    onTrainingStart?: () => void;
    onTrainingEnd?: (finalMetrics: TrainingMetrics) => void;
}
export interface TrainingPipelineConfig<InputType> {
    model: BaseModel<InputType, unknown>;
    trainingConfig: TrainingConfig;
    validationSplit: number;
    callbacks?: TrainingCallback[];
    dataPreprocessors?: Array<(data: InputType) => InputType>;
}
export declare class TrainingPipeline<InputType> {
    private config;
    private metrics;
    constructor(config: TrainingPipelineConfig<InputType>);
    private preprocessData;
    private splitValidationData;
    private updateMetrics;
    train(data: InputType[]): Promise<TrainingMetrics>;
}
//# sourceMappingURL=TrainingPipeline.d.ts.map