import * as tf from '@tensorflow/tfjs';
export class SchedulePredictor {
    constructor() {
        this.model = null;
        this.userPattern = null;
    }
    async initialize(userPattern) {
        this.userPattern = userPattern;
        this.model = await this.createModel();
        await this.loadOrTrainModel();
    }
    async createModel() {
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
    async loadOrTrainModel() {
        try {
            // Try to load from IndexedDB
            const modelInfo = await tf.loadLayersModel('indexeddb://eremois-schedule-model');
            this.model = modelInfo;
        }
        catch {
            // Train new model if loading fails
            await this.trainModel();
        }
    }
    async trainModel() {
        if (!this.model || !this.userPattern)
            return;
        // Convert user patterns to training data
        const { xs, ys } = this.prepareTrainingData();
        // Train the model
        await this.model.fit(xs, ys, {
            epochs: 50,
            batchSize: 32,
            validationSplit: 0.2,
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    console.log(`Epoch ${epoch}: loss = ${logs.loss}, accuracy = ${logs.accuracy}`);
                },
            },
        });
        // Save the trained model
        await this.model.save('indexeddb://eremois-schedule-model');
    }
    prepareTrainingData() {
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
    async predictNextBlock(input) {
        if (!this.model || !this.userPattern) {
            throw new Error('Model not initialized');
        }
        // Prepare input tensor
        const inputTensor = this.preparePredictionInput(input);
        // Make prediction
        const prediction = this.model.predict(inputTensor);
        const [blockType, duration, startTime, energy] = await prediction.data();
        prediction.dispose(); // Clean up tensor
        inputTensor.dispose(); // Clean up tensor
        // Convert prediction to TimeBlock
        const block = {
            id: crypto.randomUUID(),
            type: this.convertToBlockType(blockType),
            startTime: new Date(),
            endTime: new Date(Date.now() + duration * 60000),
            energy,
            title: `${this.convertToBlockType(blockType)} Session`,
        };
        return block;
    }
    preparePredictionInput(input) {
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
    convertToBlockType(value) {
        const types = ['FOCUS', 'BREAK', 'MEETING', 'TASK'];
        return types[Math.floor(value * types.length)];
    }
}
//# sourceMappingURL=predictor.js.map