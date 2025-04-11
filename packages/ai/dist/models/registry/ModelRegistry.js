export class ModelRegistry {
    constructor() {
        this.models = new Map();
        this.modelMetadata = new Map();
    }
    /**
     * Register a new model in the registry
     */
    async registerModel(model, config) {
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
    getModel(id) {
        const model = this.models.get(id);
        return model;
    }
    /**
     * Get metadata for a specific model
     */
    getModelMetadata(id) {
        return this.modelMetadata.get(id);
    }
    /**
     * List all registered models
     */
    listModels() {
        return Array.from(this.modelMetadata.entries()).map(([id, metadata]) => ({
            id,
            metadata,
        }));
    }
    /**
     * Check if a model version is compatible with required version
     */
    isCompatibleVersion(current, required) {
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
    async unregisterModel(id) {
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
    async dispose() {
        for (const model of this.models.values()) {
            await model.dispose();
        }
        this.models.clear();
        this.modelMetadata.clear();
    }
}
//# sourceMappingURL=ModelRegistry.js.map