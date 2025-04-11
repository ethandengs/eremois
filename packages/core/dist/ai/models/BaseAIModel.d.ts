import type { BaseModel, ModelType, ModelMetadata, TrainingData, TrainingConfig, PredictionResult } from '../types';
export declare abstract class BaseAIModel implements BaseModel {
    readonly modelType: ModelType;
    version: string;
    lastUpdated: Date;
    metadata: ModelMetadata;
    protected constructor(type: ModelType);
    abstract train(data: TrainingData, config: TrainingConfig): Promise<void>;
    abstract predict<T>(input: unknown): Promise<PredictionResult<T>>;
    abstract validate(data: TrainingData): Promise<ModelMetadata>;
    protected updateMetadata(updates: Partial<ModelMetadata>): void;
    protected incrementVersion(): void;
    protected calculateAccuracy(predictions: Array<{
        actual: number;
        predicted: number;
    }>): number;
    protected calculateFeatureImportance(features: string[], impacts: number[]): Record<string, number>;
    protected validateTrainingConfig(config: TrainingConfig): void;
    protected validateTrainingData(data: TrainingData): void;
    protected calculateConfidence(prediction: number, uncertainty: number, dataQuality: number): number;
    protected assessDataQuality(data: TrainingData): number;
    private calculateTimeRangeCoverage;
    private checkDataConsistency;
    private calculateDataRecency;
    private calculateSampleSizeAdequacy;
}
//# sourceMappingURL=BaseAIModel.d.ts.map