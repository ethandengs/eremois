import type { ModelMetadata, ModelConfig, TrainingConfig, InferenceConfig } from '../../types/model';

/**
 * Base interface for all AI models in Eremois
 */
export interface BaseModel<InputType, OutputType> {
  /**
   * Unique identifier for the model
   */
  readonly id: string;

  /**
   * Model metadata including version, description, and requirements
   */
  readonly metadata: ModelMetadata;

  /**
   * Current model configuration
   */
  readonly config: ModelConfig;

  /**
   * Initialize the model with given configuration
   */
  initialize(config: ModelConfig): Promise<void>;

  /**
   * Run inference on input data
   */
  predict(input: InputType, config?: InferenceConfig): Promise<OutputType>;

  /**
   * Update model with new training data
   */
  train(data: InputType[], config?: TrainingConfig): Promise<void>;

  /**
   * Export model state for persistence
   */
  export(): Promise<ArrayBuffer>;

  /**
   * Import model state from persisted data
   */
  import(data: ArrayBuffer): Promise<void>;

  /**
   * Release model resources
   */
  dispose(): Promise<void>;
} 