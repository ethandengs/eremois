import type { BaseModel } from '../base/BaseModel';
import type { ModelMetadata, ModelConfig } from '../../types/model';

export class ModelRegistry {
  private models: Map<string, BaseModel<unknown, unknown>> = new Map();
  private modelMetadata: Map<string, ModelMetadata> = new Map();

  /**
   * Register a new model in the registry
   */
  async registerModel<I, O>(
    model: BaseModel<I, O>,
    config?: ModelConfig
  ): Promise<void> {
    if (this.models.has(model.id)) {
      throw new Error(`Model with ID ${model.id} already registered`);
    }

    if (config) {
      await model.initialize(config);
    }

    this.models.set(model.id, model);
    this.modelMetadata.set(model.id, model.metadata);
  }

  /**
   * Get a model by ID with proper type casting
   */
  getModel<I, O>(id: string): BaseModel<I, O> | undefined {
    const model = this.models.get(id);
    return model as BaseModel<I, O> | undefined;
  }

  /**
   * Get metadata for a specific model
   */
  getModelMetadata(id: string): ModelMetadata | undefined {
    return this.modelMetadata.get(id);
  }

  /**
   * List all registered models
   */
  listModels(): Array<{ id: string; metadata: ModelMetadata }> {
    return Array.from(this.modelMetadata.entries()).map(([id, metadata]) => ({
      id,
      metadata,
    }));
  }

  /**
   * Check if a model version is compatible with required version
   */
  isCompatibleVersion(
    current: ModelMetadata['version'],
    required: ModelMetadata['version']
  ): boolean {
    // Major version must match exactly
    if (current.major !== required.major) {
      return false;
    }

    // Current minor version must be >= required
    if (current.minor < required.minor) {
      return false;
    }

    // If minor versions match, current patch must be >= required
    if (current.minor === required.minor && current.patch < required.patch) {
      return false;
    }

    return true;
  }

  /**
   * Unregister a model and release its resources
   */
  async unregisterModel(id: string): Promise<void> {
    const model = this.models.get(id);
    if (model) {
      await model.dispose();
      this.models.delete(id);
      this.modelMetadata.delete(id);
    }
  }

  /**
   * Release all models and clear registry
   */
  async dispose(): Promise<void> {
    for (const model of this.models.values()) {
      await model.dispose();
    }
    this.models.clear();
    this.modelMetadata.clear();
  }
} 