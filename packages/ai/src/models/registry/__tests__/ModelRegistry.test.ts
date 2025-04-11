import { ModelRegistry } from '../ModelRegistry';
import type { BaseModel } from '../../base/BaseModel';
import type { ModelMetadata, ModelConfig } from '../../../types/model';

describe('ModelRegistry', () => {
  let registry: ModelRegistry;

  // Mock model implementation
  class MockModel implements BaseModel<string, number> {
    readonly id = 'mock-model-v1';
    readonly metadata: ModelMetadata = {
      version: { major: 1, minor: 0, patch: 0 },
      description: 'Mock model for testing',
      author: 'Test Author',
      license: 'MIT',
      requirements: {
        memory: 128,
        compute: 3,
      },
    };

    private _config: ModelConfig = {
      deviceType: 'cpu',
      precision: 'float32',
      maxMemoryUsage: 256,
      timeout: 1000,
    };

    get config(): ModelConfig {
      return this._config;
    }

    async initialize(config: ModelConfig): Promise<void> {
      this._config = { ...this._config, ...config };
    }

    async predict(): Promise<number> {
      return 42;
    }

    async train(): Promise<void> {
      // Mock training
    }

    async export(): Promise<ArrayBuffer> {
      return new ArrayBuffer(0);
    }

    async import(): Promise<void> {
      // Mock import
    }

    async dispose(): Promise<void> {
      // Mock cleanup
    }
  }

  beforeEach(() => {
    registry = new ModelRegistry();
  });

  afterEach(async () => {
    await registry.dispose();
  });

  it('should register a model successfully', async () => {
    const model = new MockModel();
    await registry.registerModel(model);
    expect(registry.getModel(model.id)).toBeDefined();
  });

  it('should prevent duplicate model registration', async () => {
    const model = new MockModel();
    await registry.registerModel(model);
    await expect(registry.registerModel(model)).rejects.toThrow();
  });

  it('should return model metadata', async () => {
    const model = new MockModel();
    await registry.registerModel(model);
    const metadata = registry.getModelMetadata(model.id);
    expect(metadata).toEqual(model.metadata);
  });

  it('should list all registered models', async () => {
    const model = new MockModel();
    await registry.registerModel(model);
    const models = registry.listModels();
    expect(models).toHaveLength(1);
    expect(models[0]).toEqual({
      id: model.id,
      metadata: model.metadata,
    });
  });

  it('should check version compatibility correctly', () => {
    const current = { major: 1, minor: 2, patch: 3 };
    const required = { major: 1, minor: 1, patch: 0 };
    expect(registry.isCompatibleVersion(current, required)).toBe(true);
  });

  it('should reject incompatible versions', () => {
    const current = { major: 1, minor: 0, patch: 0 };
    const required = { major: 2, minor: 0, patch: 0 };
    expect(registry.isCompatibleVersion(current, required)).toBe(false);
  });

  it('should unregister a model and release resources', async () => {
    const model = new MockModel();
    await registry.registerModel(model);
    await registry.unregisterModel(model.id);
    expect(registry.getModel(model.id)).toBeUndefined();
  });
}); 