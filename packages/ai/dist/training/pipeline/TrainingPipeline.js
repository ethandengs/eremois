export class TrainingPipeline {
    constructor(config) {
        this.metrics = {
            loss: 0,
            accuracy: 0,
            epochTime: 0,
            memoryUsage: 0,
        };
        this.config = config;
    }
    async preprocessData(data) {
        const preprocessors = this.config.dataPreprocessors;
        if (!preprocessors?.length) {
            return data;
        }
        return data.map(item => preprocessors.reduce((processed, preprocessor) => preprocessor(processed), item));
    }
    splitValidationData(data) {
        const splitIndex = Math.floor(data.length * (1 - this.config.validationSplit));
        return [
            data.slice(0, splitIndex),
            data.slice(splitIndex),
        ];
    }
    async updateMetrics(epoch, batchIndex, metrics) {
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
    async train(data) {
        const callbacks = this.config.callbacks || [];
        for (const callback of callbacks) {
            if (callback.onTrainingStart) {
                await callback.onTrainingStart();
            }
        }
        const preprocessedData = await this.preprocessData(data);
        const [trainingData, validationData] = this.splitValidationData(preprocessedData);
        await this.config.model.train(trainingData, this.config.trainingConfig);
        for (const callback of callbacks) {
            if (callback.onTrainingEnd) {
                await callback.onTrainingEnd(this.metrics);
            }
        }
        return this.metrics;
    }
}
//# sourceMappingURL=TrainingPipeline.js.map