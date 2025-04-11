export class ModelRegistry {
    constructor(storage) {
        this.STORAGE_KEY = 'ai_models';
        this.models = new Map();
        this.storage = storage;
        this.loadModels().catch(console.error);
    }
    async loadModels() {
        const storedModels = await this.storage.get(this.STORAGE_KEY);
        if (storedModels) {
            this.models = new Map(Object.entries(storedModels));
        }
    }
    async saveModels() {
        const modelObject = Object.fromEntries(this.models.entries());
        await this.storage.set(this.STORAGE_KEY, modelObject);
    }
    async registerModel(type, model) {
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
    async getModel(type) {
        const model = this.models.get(type);
        if (!model) {
            throw new Error(`Model of type ${type} not found`);
        }
        return model;
    }
    async listModels() {
        return Array.from(this.models.entries()).map(([type, model]) => ({
            type,
            metadata: model.metadata,
        }));
    }
    async deleteModel(type) {
        if (!this.models.has(type)) {
            throw new Error(`Model of type ${type} not found`);
        }
        this.models.delete(type);
        await this.saveModels();
    }
    async updateMetadata(type, metadata) {
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
    validateModelStructure(model) {
        // Ensure all required fields are present
        const requiredFields = ['modelType', 'version', 'lastUpdated', 'metadata'];
        for (const field of requiredFields) {
            if (!(field in model)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        // Validate metadata structure
        const requiredMetadataFields = [
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
    async hasModel(type) {
        return this.models.has(type);
    }
    // Helper method to get model version
    async getModelVersion(type) {
        const model = await this.getModel(type);
        return model.version;
    }
    // Helper method to get last update time
    async getLastUpdateTime(type) {
        const model = await this.getModel(type);
        return model.lastUpdated;
    }
    // Helper method to check if model needs update
    async needsUpdate(type, maxAgeDays) {
        try {
            const model = await this.getModel(type);
            const ageInDays = (Date.now() - model.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
            return ageInDays > maxAgeDays;
        }
        catch {
            return true; // If model doesn't exist, it needs to be created
        }
    }
}
//# sourceMappingURL=ModelRegistry.js.map