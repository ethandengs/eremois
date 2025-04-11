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
    memory: number;  // Required memory in MB
    compute: number; // Required compute score (1-10)
  };
}

/**
 * Base configuration for all models
 */
export interface ModelConfig {
  deviceType: 'cpu' | 'gpu' | 'auto';
  precision: 'float32' | 'float16' | 'int8';
  maxMemoryUsage: number; // MB
  timeout: number; // ms
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
  maxTimePerEpoch: number; // ms
}

/**
 * Configuration for model inference
 */
export interface InferenceConfig {
  batchSize: number;
  maxTimePerPrediction: number; // ms
  confidenceThreshold: number;
} 