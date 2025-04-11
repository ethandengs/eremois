/**
 * Model version following semantic versioning
 */
export interface ModelVersion {
    major: number;
    minor: number;
    patch: number;
}
/**
 * Model metadata containing version and requirements
 */
export interface ModelMetadata {
    version: ModelVersion;
    description: string;
    author: string;
    license: string;
    requirements: {
        memory: number;
        compute: number;
    };
}
/**
 * Base configuration for all models
 */
export interface ModelConfig {
    deviceType: 'cpu' | 'gpu' | 'auto';
    precision: 'float32' | 'float16' | 'int8';
    maxMemoryUsage: number;
    timeout: number;
}
/**
 * Configuration for model training
 */
export interface TrainingConfig {
    batchSize: number;
    epochs: number;
    learningRate: number;
    validationSplit: number;
    earlyStoppingPatience: number;
    maxTimePerEpoch: number;
}
/**
 * Configuration for model inference
 */
export interface InferenceConfig {
    batchSize: number;
    maxTimePerPrediction: number;
    confidenceThreshold: number;
}
//# sourceMappingURL=model.d.ts.map