import type { TimeBlock, UserPattern } from '../types';
import type { Task } from '../tasks/types';
import type { ProductivityMetrics } from '../patterns/UserPatternManager';

export type ModelType = 'productivity' | 'focus' | 'scheduling';

export interface ModelMetadata {
  accuracy: number;
  trainingIterations: number;
  lastTrainingDuration: number;
  parameters: Record<string, number>;
  featureImportance: Record<string, number>;
}

export interface BaseModel {
  modelType: ModelType;
  version: string;
  lastUpdated: Date;
  metadata: ModelMetadata;
}

export interface TrainingData {
  timeBlocks: TimeBlock[];
  tasks: Task[];
  userPattern: UserPattern;
  productivity: ProductivityMetrics;
  timestamp: Date;
}

export interface TrainingConfig {
  learningRate: number;
  batchSize: number;
  epochs: number;
  validationSplit: number;
  earlyStoppingPatience: number;
}

export interface PredictionResult<T> {
  value: T;
  confidence: number;
  factors: Array<{
    name: string;
    importance: number;
  }>;
  timestamp: Date;
}

export interface ModelManager<T extends BaseModel> {
  loadModel(type: ModelType): Promise<T>;
  saveModel(model: T): Promise<void>;
  updateModel(data: TrainingData, config?: TrainingConfig): Promise<void>;
  predict<R>(input: unknown): Promise<PredictionResult<R>>;
  getMetadata(): ModelMetadata;
  validateModel(validationData: TrainingData): Promise<ModelMetadata>;
}

export interface TrainingPipeline {
  preprocess(data: TrainingData): Promise<unknown>;
  train(preprocessedData: unknown, config: TrainingConfig): Promise<void>;
  validate(validationData: unknown): Promise<ModelMetadata>;
}

export interface InferenceEngine {
  predict<T>(input: unknown): Promise<PredictionResult<T>>;
  getCachedPrediction<T>(key: string): Promise<PredictionResult<T> | null>;
  clearCache(): Promise<void>;
}

export interface ModelRegistry {
  registerModel(type: ModelType, model: BaseModel): Promise<void>;
  getModel(type: ModelType): Promise<BaseModel>;
  listModels(): Promise<Array<{ type: ModelType; metadata: ModelMetadata }>>;
  deleteModel(type: ModelType): Promise<void>;
  updateMetadata(type: ModelType, metadata: Partial<ModelMetadata>): Promise<void>;
}

export interface OptimizationResult {
  schedule: TimeBlock[];
  predictedProductivity: number;
  confidence: number;
  suggestions: Array<{
    type: 'break' | 'focus' | 'task';
    startTime: Date;
    duration: number;
    reason: string;
  }>;
}

export interface ProductivityPrediction {
  optimalHours: Array<{
    dayOfWeek: number;
    hour: number;
    score: number;
  }>;
  focusPeriods: Array<{
    startTime: Date;
    duration: number;
    predictedProductivity: number;
  }>;
  breakSuggestions: Array<{
    afterMinutes: number;
    duration: number;
    importance: number;
  }>;
}

export interface PatternInsight {
  type: 'productivity' | 'focus' | 'break' | 'schedule';
  importance: number;
  description: string;
  suggestion: string;
  confidence: number;
  relatedMetrics: Record<string, number>;
} 