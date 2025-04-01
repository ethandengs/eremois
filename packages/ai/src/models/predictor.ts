import * as tf from '@tensorflow/tfjs';
import type { TimeBlock, PredictionInput, UserPattern } from './types';

interface TrainingLogs {
  loss?: number;
  accuracy?: number;
  val_loss?: number;
  val_accuracy?: number;
  [key: string]: number | undefined;
}

export class SchedulePredictor {
  private model: tf.LayersModel | null = null;
  private userPattern: UserPattern | null = null;

  async initialize(userPattern: UserPattern): Promise<void> {
    this.userPattern = userPattern;
    this.model = await this.createModel();
    await this.loadOrTrainModel();
  }

  private async createModel(): Promise<tf.LayersModel> {
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
      const modelInfo = await tf.loadLayersModel('indexeddb://eremois-schedule-model');
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
        onEpochEnd: async (epoch: number, logs: TrainingLogs): Promise<void> => {
          console.log(`Epoch ${epoch}: loss = ${logs.loss}, accuracy = ${logs.accuracy}`);
        },
      },
    });

    // Save the trained model
    await this.model.save('indexeddb://eremois-schedule-model');
  }

  private prepareTrainingData(): { xs: tf.Tensor2D; ys: tf.Tensor2D } {
    if (!this.userPattern) {
      throw new Error('User pattern not initialized');
    }

    // Convert user patterns to features
    const features = [
      ...this.userPattern.preferredWorkingHours.map(h => h / 24),
      Object.values(this.userPattern.energyPattern),
      Object.values(this.userPattern.taskPreferences),
    ].flat();

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
    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const [blockType, duration, startTime, energy] = await prediction.data();

    prediction.dispose(); // Clean up tensor
    inputTensor.dispose(); // Clean up tensor

    // Convert prediction to TimeBlock
    const block: TimeBlock = {
      id: crypto.randomUUID(),
      type: this.convertToBlockType(blockType),
      startTime: new Date(),
      endTime: new Date(Date.now() + duration * 60000),
      energy,
      title: `${this.convertToBlockType(blockType)} Session`,
    };

    return block;
  }

  private preparePredictionInput(input: PredictionInput): tf.Tensor2D {
    const timeFeatures = [
      input.currentTime.getHours() / 24,
      input.currentTime.getDay() / 7,
    ];

    const blockFeatures = input.previousBlocks.slice(-3).map(block => [
      ['FOCUS', 'BREAK', 'MEETING', 'TASK'].indexOf(block.type) / 4,
      (block.endTime.getTime() - block.startTime.getTime()) / (24 * 60 * 60 * 1000),
    ]).flat();

    const features = [...timeFeatures, ...blockFeatures];
    return tf.tensor2d([features]);
  }

  private convertToBlockType(value: number): TimeBlock['type'] {
    const types: TimeBlock['type'][] = ['FOCUS', 'BREAK', 'MEETING', 'TASK'];
    return types[Math.floor(value * types.length)];
  }
} 