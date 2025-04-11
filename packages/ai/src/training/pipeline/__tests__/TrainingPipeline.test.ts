import { TrainingPipeline } from '../TrainingPipeline';
import type { BaseModel } from '../../../models/base/BaseModel';
import type { ModelConfig, TrainingConfig } from '../../../types/model';
import type { TrainingCallback, TrainingMetrics } from '../TrainingPipeline';

describe('TrainingPipeline', () => {
  // Mock model for testing
  class MockModel implements BaseModel<number[], number> {
    readonly id = 'mock-training-model';
    readonly metadata = {
      version: { major: 1, minor: 0, patch: 0 },
      description: 'Mock model for training tests',
      author: 'Test Author',
      license: 'MIT',
      requirements: { memory: 128, compute: 3 },
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

    async import(): Promise<void> {}

    async dispose(): Promise<void> {}
  }

  const mockTrainingConfig: TrainingConfig = {
    batchSize: 32,
    epochs: 10,
    learningRate: 0.001,
    validationSplit: 0.2,
    earlyStoppingPatience: 3,
    maxTimePerEpoch: 1000,
  };

  let model: MockModel;
  let pipeline: TrainingPipeline<number[]>;
  let mockCallbacks: jest.Mocked<TrainingCallback>;

  beforeEach(() => {
    model = new MockModel();
    mockCallbacks = {
      onEpochStart: jest.fn(),
      onEpochEnd: jest.fn(),
      onBatchEnd: jest.fn(),
      onTrainingStart: jest.fn(),
      onTrainingEnd: jest.fn(),
    };

    pipeline = new TrainingPipeline({
      model,
      trainingConfig: mockTrainingConfig,
      validationSplit: 0.2,
      callbacks: [mockCallbacks],
    });
  });

  it('should preprocess data correctly', async () => {
    const preprocessor = jest.fn((data: number[]) => data.map(x => x * 2));
    const pipeline = new TrainingPipeline({
      model,
      trainingConfig: mockTrainingConfig,
      validationSplit: 0.2,
      dataPreprocessors: [preprocessor],
    });

    const testData = [[1, 2, 3], [4, 5, 6]];
    await pipeline.train(testData);

    expect(preprocessor).toHaveBeenCalled();
  });

  it('should split validation data correctly', async () => {
    // Create a spy that captures the training data
    let capturedTrainingData: number[][] | undefined;
    jest.spyOn(model, 'train').mockImplementation(async (data: number[][]) => {
      capturedTrainingData = data;
    });

    const testData = Array.from({ length: 100 }, (_, i) => [i]);
    await pipeline.train(testData);

    // Verify the training data
    expect(capturedTrainingData).toBeDefined();
    expect(Array.isArray(capturedTrainingData)).toBe(true);
    expect(capturedTrainingData).toHaveLength(80);
  });

  it('should call callbacks in correct order', async () => {
    const callOrder: string[] = [];
    const orderedCallbacks: TrainingCallback = {
      onTrainingStart: () => { callOrder.push('start'); },
      onTrainingEnd: () => { callOrder.push('end'); },
    };

    const orderPipeline = new TrainingPipeline({
      model,
      trainingConfig: mockTrainingConfig,
      validationSplit: 0.2,
      callbacks: [orderedCallbacks],
    });

    const testData = [[1, 2, 3], [4, 5, 6]];
    await orderPipeline.train(testData);

    expect(callOrder).toEqual(['start', 'end']);
  });

  it('should handle training errors gracefully', async () => {
    const errorModel = new MockModel();
    jest.spyOn(errorModel, 'train').mockRejectedValue(new Error('Training failed'));

    const errorPipeline = new TrainingPipeline({
      model: errorModel,
      trainingConfig: mockTrainingConfig,
      validationSplit: 0.2,
    });

    await expect(errorPipeline.train([[1, 2, 3]])).rejects.toThrow('Training failed');
  });

  it('should update metrics during training', async () => {
    let lastMetrics: TrainingMetrics | undefined;
    const metricsCallback: TrainingCallback = {
      onTrainingEnd: (metrics) => {
        lastMetrics = metrics;
      },
    };

    const metricsPipeline = new TrainingPipeline({
      model,
      trainingConfig: mockTrainingConfig,
      validationSplit: 0.2,
      callbacks: [metricsCallback],
    });

    await metricsPipeline.train([[1, 2, 3]]);

    expect(lastMetrics).toBeDefined();
    expect(lastMetrics?.loss).toBeGreaterThanOrEqual(0);
    expect(lastMetrics?.accuracy).toBeGreaterThanOrEqual(0);
    expect(lastMetrics?.epochTime).toBeGreaterThan(0);
    expect(lastMetrics?.memoryUsage).toBeGreaterThan(0);
  });
}); 