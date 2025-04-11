import type { StorageAdapter } from '../../storage/types';
import type { ModelType, BaseModel, ModelMetadata, ModelRegistry as IModelRegistry } from '../types';
export declare class ModelRegistry implements IModelRegistry {
    private readonly storage;
    private readonly STORAGE_KEY;
    private models;
    constructor(storage: StorageAdapter);
    private loadModels;
    private saveModels;
    registerModel(type: ModelType, model: BaseModel): Promise<void>;
    getModel(type: ModelType): Promise<BaseModel>;
    listModels(): Promise<Array<{
        type: ModelType;
        metadata: ModelMetadata;
    }>>;
    deleteModel(type: ModelType): Promise<void>;
    updateMetadata(type: ModelType, metadata: Partial<ModelMetadata>): Promise<void>;
    private validateModelStructure;
    hasModel(type: ModelType): Promise<boolean>;
    getModelVersion(type: ModelType): Promise<string>;
    getLastUpdateTime(type: ModelType): Promise<Date>;
    needsUpdate(type: ModelType, maxAgeDays: number): Promise<boolean>;
}
//# sourceMappingURL=ModelRegistry.d.ts.map