import type { BaseModel } from '../../models/base/BaseModel';
import type { TrainingConfig } from '../../types/model';

export interface TrainingMetrics {
  loss: number;
  accuracy: number;
  epochTime: number;
  memoryUsage: number;
}

export interface TrainingCallback {
  onEpochStart?: (epoch: number) => void;
  onEpochEnd?: (epoch: number, metrics: TrainingMetrics) => void;
  onBatchEnd?: (batch: number, metrics: TrainingMetrics) => void;
  onTrainingStart?: () => void;
  onTrainingEnd?: (finalMetrics: TrainingMetrics) => void;
}

export interface TrainingPipelineConfig<InputType> {
  model: BaseModel<InputType, unknown>;
  trainingConfig: TrainingConfig;
  validationSplit: number;
  callbacks?: TrainingCallback[];
  dataPreprocessors?: Array<(data: InputType) => InputType>;
}

export class TrainingPipeline<InputType> {
  private config: TrainingPipelineConfig<InputType>;
  private metrics: TrainingMetrics = {
    loss: 0,
    accuracy: 0,
    epochTime: 0,
    memoryUsage: 0,
  };

  constructor(config: TrainingPipelineConfig<InputType>) {
    this.config = config;
  }

  private async preprocessData(data: InputType[]): Promise<InputType[]> {
    const preprocessors = this.config.dataPreprocessors;
    if (!preprocessors?.length) {
      return data;
    }

    return data.map(item =>
      preprocessors.reduce(
        (processed, preprocessor) => preprocessor(processed),
        item
      )
    );
  }

  private splitValidationData(
    data: InputType[]
  ): [InputType[], InputType[]] {
    const splitIndex = Math.floor(
      data.length * (1 - this.config.validationSplit)
    );
    return [
      data.slice(0, splitIndex),
      data.slice(splitIndex),
    ];
  }

  private async updateMetrics(
    epoch: number,
    batchIndex: number,
    metrics: Partial<TrainingMetrics>
  ): Promise<void> {
    this.metrics = { ...this.metrics, ...metrics };

    const callbacks = this.config.callbacks || [];
    for (const callback of callbacks) {
      if (metrics.epochTime && callback.onEpochEnd) {
        await callback.onEpochEnd(epoch, this.metrics);
      }
      if (callback.onBatchEnd) {
        await callback.onBatchEnd(batchIndex, this.metrics);
      }
    }
  }

  async train(data: InputType[]): Promise<TrainingMetrics> {
    const callbacks = this.config.callbacks || [];
    for (const callback of callbacks) {
      if (callback.onTrainingStart) {
        await callback.onTrainingStart();
      }
    }

    const preprocessedData = await this.preprocessData(data);
    const [trainingData, validationData] = this.splitValidationData(
      preprocessedData
    );

    await this.config.model.train(trainingData, this.config.trainingConfig);

    for (const callback of callbacks) {
      if (callback.onTrainingEnd) {
        await callback.onTrainingEnd(this.metrics);
      }
    }

    return this.metrics;
  }
} 