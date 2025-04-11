import type { BaseModel } from '../base/BaseModel';
import type { ModelMetadata, ModelConfig } from '../../types/model';
export declare class ModelRegistry {
    private models;
    private modelMetadata;
    /**
     * Register a new model in the registry
     */
    registerModel<I, O>(model: BaseModel<I, O>, config?: ModelConfig): Promise<void>;
    /**
     * Get a model by ID with proper type casting
     */
    getModel<I, O>(id: string): BaseModel<I, O> | undefined;
    /**
     * Get metadata for a specific model
     */
    getModelMetadata(id: string): ModelMetadata | undefined;
    /**
     * List all registered models
     */
    listModels(): Array<{
        id: string;
        metadata: ModelMetadata;
    }>;
    /**
     * Check if a model version is compatible with required version
     */
    isCompatibleVersion(current: ModelMetadata['version'], required: ModelMetadata['version']): boolean;
    /**
     * Unregister a model and release its resources
     */
    unregisterModel(id: string): Promise<void>;
    /**
     * Release all models and clear registry
     */
    dispose(): Promise<void>;
}
//# sourceMappingURL=ModelRegistry.d.ts.map