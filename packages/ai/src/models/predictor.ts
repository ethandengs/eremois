import * as tf from '@tensorflow/tfjs';
import type { Sequential, Tensor, Tensor2D } from '@tensorflow/tfjs-layers';
import type { Logs } from '@tensorflow/tfjs-core';
import type { TimeBlock, PredictionInput, UserPattern } from './types';

interface TrainingLogs {
  loss?: number;
  accuracy?: number;
  val_loss?: number;
  val_accuracy?: number;
  [key: string]: number | undefined;
}

export class SchedulePredictor {
  private model: Sequential | null = null;
  private userPattern: UserPattern | null = null;

  async initialize(userPattern: UserPattern): Promise<void> {
    this.userPattern = userPattern;
    this.model = await this.createModel();
    await this.loadOrTrainModel();
  }

  private async createModel(): Promise<Sequential> {
    const model = tf.sequential();

    // Input layer for time features and user patterns
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [12], // Time + Energy + Task features
    }));

    // Hidden layers
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));

    // Output layer for schedule recommendations
    model.add(tf.layers.dense({
      units: 4, // [block_type, duration, start_time, energy_required]
      activation: 'sigmoid',
    }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['accuracy'],
    });

    return model;
  }

  private async loadOrTrainModel(): Promise<void> {
    try {
      // Try to load from IndexedDB
      const modelInfo = await tf.loadLayersModel('indexeddb://eremois-schedule-model') as Sequential;
      this.model = modelInfo;
    } catch {
      // Train new model if loading fails
      await this.trainModel();
    }
  }

  private async trainModel(): Promise<void> {
    if (!this.model || !this.userPattern) return;

    // Convert user patterns to training data
    const { xs, ys } = this.prepareTrainingData();

    // Train the model
    await this.model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: async (epoch: number, logs?: Logs): Promise<void> => {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss}, accuracy = ${logs?.accuracy}`);
        },
      },
    });

    // Save the trained model
    await this.model.save('indexeddb://eremois-schedule-model');
  }

  private prepareTrainingData(): { xs: Tensor2D; ys: Tensor2D } {
    if (!this.userPattern) {
      throw new Error('User pattern not initialized');
    }

    // Convert user patterns to features
    const features = [
      ...this.userPattern.preferredWorkingHours.map(h => h / 24),
      Object.values(this.userPattern.energyPattern),
      Object.values(this.userPattern.taskPreferences),
    ].flatMap(x => x);

    return {
      xs: tf.tensor2d([features]),
      ys: tf.tensor2d([[0.25, 0.25, 0.25, 0.25]]), // Equal probabilities for each block type
    };
  }

  async predictNextBlock(input: PredictionInput): Promise<TimeBlock> {
    if (!this.model || !this.userPattern) {
      throw new Error('Model not initialized');
    }

    // Prepare input tensor
    const inputTensor = this.preparePredictionInput(input);

    // Make prediction
    const prediction = this.model.predict(inputTensor) as Tensor;
    const [blockType, duration, startTime, energy] = await prediction.data();

    prediction.dispose(); // Clean up tensor
    inputTensor.dispose(); // Clean up tensor

    const now = new Date();
    // Convert prediction to TimeBlock
    const block: TimeBlock = {
      id: crypto.randomUUID(),
      type: this.convertToBlockType(blockType),
      start: now,
      end: new Date(now.getTime() + duration * 60000),
      energy,
      productivity: 0.8, // Default productivity score
    };

    return block;
  }

  private preparePredictionInput(input: PredictionInput): Tensor2D {
    const timeFeatures = [
      input.timeOfDay,
      input.dayOfWeek,
    ];

    const blockFeatures = input.previousBlocks.slice(-3).flatMap(block => [
      ['FOCUS', 'BREAK', 'MEETING', 'TASK'].indexOf(block.type) / 4,
      (block.end.getTime() - block.start.getTime()) / (24 * 60 * 60 * 1000),
    ]);

    const features = [...timeFeatures, ...blockFeatures];
    return tf.tensor2d([features]);
  }

  private convertToBlockType(value: number): TimeBlock['type'] {
    const types: TimeBlock['type'][] = ['FOCUS', 'BREAK', 'MEETING', 'TASK'];
    return types[Math.floor(value * types.length)];
  }
} 