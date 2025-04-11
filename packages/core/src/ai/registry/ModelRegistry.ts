import type { StorageAdapter } from '../../storage/types';
import type {
  ModelType,
  BaseModel,
  ModelMetadata,
  ModelRegistry as IModelRegistry,
} from '../types';

export class ModelRegistry implements IModelRegistry {
  private readonly storage: StorageAdapter;
  private readonly STORAGE_KEY = 'ai_models';
  private models: Map<ModelType, BaseModel> = new Map();

  constructor(storage: StorageAdapter) {
    this.storage = storage;
    this.loadModels().catch(console.error);
  }

  private async loadModels(): Promise<void> {
    const storedModels = await this.storage.get<Record<ModelType, BaseModel>>(this.STORAGE_KEY);
    if (storedModels) {
      this.models = new Map(Object.entries(storedModels) as [ModelType, BaseModel][]);
    }
  }

  private async saveModels(): Promise<void> {
    const modelObject = Object.fromEntries(this.models.entries());
    await this.storage.set(this.STORAGE_KEY, modelObject);
  }

  async registerModel(type: ModelType, model: BaseModel): Promise<void> {
    // Validate model structure
    this.validateModelStructure(model);

    // Update model metadata
    const updatedModel = {
      ...model,
      lastUpdated: new Date(),
    };

    this.models.set(type, updatedModel);
    await this.saveModels();
  }

  async getModel(type: ModelType): Promise<BaseModel> {
    const model = this.models.get(type);
    if (!model) {
      throw new Error(`Model of type ${type} not found`);
    }
    return model;
  }

  async listModels(): Promise<Array<{ type: ModelType; metadata: ModelMetadata }>> {
    return Array.from(this.models.entries()).map(([type, model]) => ({
      type,
      metadata: model.metadata,
    }));
  }

  async deleteModel(type: ModelType): Promise<void> {
    if (!this.models.has(type)) {
      throw new Error(`Model of type ${type} not found`);
    }

    this.models.delete(type);
    await this.saveModels();
  }

  async updateMetadata(type: ModelType, metadata: Partial<ModelMetadata>): Promise<void> {
    const model = await this.getModel(type);
    
    const updatedModel = {
      ...model,
      metadata: {
        ...model.metadata,
        ...metadata,
      },
      lastUpdated: new Date(),
    };

    this.models.set(type, updatedModel);
    await this.saveModels();
  }

  private validateModelStructure(model: BaseModel): void {
    // Ensure all required fields are present
    const requiredFields: Array<keyof BaseModel> = ['modelType', 'version', 'lastUpdated', 'metadata'];
    for (const field of requiredFields) {
      if (!(field in model)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate metadata structure
    const requiredMetadataFields: Array<keyof ModelMetadata> = [
      'accuracy',
      'trainingIterations',
      'lastTrainingDuration',
      'parameters',
      'featureImportance',
    ];

    for (const field of requiredMetadataFields) {
      if (!(field in model.metadata)) {
        throw new Error(`Missing required metadata field: ${field}`);
      }
    }

    // Validate types
    if (typeof model.version !== 'string') {
      throw new Error('Model version must be a string');
    }

    if (!(model.lastUpdated instanceof Date)) {
      throw new Error('Model lastUpdated must be a Date');
    }

    if (typeof model.metadata.accuracy !== 'number' || 
        model.metadata.accuracy < 0 || 
        model.metadata.accuracy > 1) {
      throw new Error('Model accuracy must be a number between 0 and 1');
    }

    if (typeof model.metadata.trainingIterations !== 'number' || 
        model.metadata.trainingIterations < 0) {
      throw new Error('Training iterations must be a non-negative number');
    }
  }

  // Helper method to check if a model exists
  async hasModel(type: ModelType): Promise<boolean> {
    return this.models.has(type);
  }

  // Helper method to get model version
  async getModelVersion(type: ModelType): Promise<string> {
    const model = await this.getModel(type);
    return model.version;
  }

  // Helper method to get last update time
  async getLastUpdateTime(type: ModelType): Promise<Date> {
    const model = await this.getModel(type);
    return model.lastUpdated;
  }

  // Helper method to check if model needs update
  async needsUpdate(type: ModelType, maxAgeDays: number): Promise<boolean> {
    try {
      const model = await this.getModel(type);
      const ageInDays = (Date.now() - model.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
      return ageInDays > maxAgeDays;
    } catch {
      return true; // If model doesn't exist, it needs to be created
    }
  }
} 