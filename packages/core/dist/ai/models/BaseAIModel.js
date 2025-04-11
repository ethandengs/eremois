export class BaseAIModel {
    constructor(type) {
        this.modelType = type;
        this.version = '1.0.0';
        this.lastUpdated = new Date();
        this.metadata = {
            accuracy: 0,
            trainingIterations: 0,
            lastTrainingDuration: 0,
            parameters: {},
            featureImportance: {},
        };
    }
    // Common utility methods
    updateMetadata(updates) {
        this.metadata = {
            ...this.metadata,
            ...updates,
        };
        this.lastUpdated = new Date();
    }
    incrementVersion() {
        const [major, minor, patch] = this.version.split('.').map(Number);
        this.version = `${major}.${minor}.${patch + 1}`;
    }
    calculateAccuracy(predictions) {
        if (predictions.length === 0)
            return 0;
        const errors = predictions.map(p => Math.abs(p.actual - p.predicted));
        const meanError = errors.reduce((sum, err) => sum + err, 0) / predictions.length;
        // Convert mean error to accuracy (0-1 scale)
        return Math.max(0, Math.min(1, 1 - meanError));
    }
    calculateFeatureImportance(features, impacts) {
        const total = impacts.reduce((sum, impact) => sum + Math.abs(impact), 0);
        return features.reduce((importance, feature, index) => {
            importance[feature] = Math.abs(impacts[index]) / total;
            return importance;
        }, {});
    }
    validateTrainingConfig(config) {
        if (config.learningRate <= 0 || config.learningRate > 1) {
            throw new Error('Learning rate must be between 0 and 1');
        }
        if (config.batchSize < 1) {
            throw new Error('Batch size must be at least 1');
        }
        if (config.epochs < 1) {
            throw new Error('Number of epochs must be at least 1');
        }
        if (config.validationSplit <= 0 || config.validationSplit >= 1) {
            throw new Error('Validation split must be between 0 and 1');
        }
        if (config.earlyStoppingPatience < 0) {
            throw new Error('Early stopping patience must be non-negative');
        }
    }
    validateTrainingData(data) {
        if (!data.timeBlocks || data.timeBlocks.length === 0) {
            throw new Error('Training data must include time blocks');
        }
        if (!data.tasks || data.tasks.length === 0) {
            throw new Error('Training data must include tasks');
        }
        if (!data.userPattern) {
            throw new Error('Training data must include user pattern');
        }
        if (!data.productivity) {
            throw new Error('Training data must include productivity metrics');
        }
        if (!data.timestamp) {
            throw new Error('Training data must include timestamp');
        }
    }
    calculateConfidence(prediction, uncertainty, dataQuality) {
        // Normalize uncertainty to 0-1 scale (higher uncertainty = lower confidence)
        const uncertaintyFactor = Math.max(0, Math.min(1, 1 - uncertainty));
        // Combine with data quality score
        const qualityFactor = Math.max(0, Math.min(1, dataQuality));
        // Weight factors (can be adjusted based on importance)
        const uncertaintyWeight = 0.7;
        const qualityWeight = 0.3;
        return (uncertaintyFactor * uncertaintyWeight +
            qualityFactor * qualityWeight);
    }
    assessDataQuality(data) {
        const factors = [
            // Time range coverage
            this.calculateTimeRangeCoverage(data.timeBlocks),
            // Data consistency
            this.checkDataConsistency(data),
            // Data recency
            this.calculateDataRecency(data.timestamp),
            // Sample size adequacy
            this.calculateSampleSizeAdequacy(data),
        ];
        return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
    }
    calculateTimeRangeCoverage(timeBlocks) {
        if (timeBlocks.length === 0)
            return 0;
        const timestamps = timeBlocks.flatMap(block => [
            block.startTime.getTime(),
            block.endTime.getTime(),
        ]);
        const minTime = Math.min(...timestamps);
        const maxTime = Math.max(...timestamps);
        const totalDuration = maxTime - minTime;
        const coveredDuration = timeBlocks.reduce((sum, block) => sum + (block.endTime.getTime() - block.startTime.getTime()), 0);
        return Math.min(1, coveredDuration / totalDuration);
    }
    checkDataConsistency(data) {
        const checks = [
            // Check if all time blocks have valid start/end times
            data.timeBlocks.every(block => block.startTime < block.endTime),
            // Check if all tasks have required fields
            data.tasks.every(task => task.id && task.title),
            // Check if user pattern has required fields
            Boolean(data.userPattern.preferredFocusDuration),
            // Check if productivity metrics are present
            Boolean(data.productivity.averageFocusDuration),
        ];
        return checks.filter(Boolean).length / checks.length;
    }
    calculateDataRecency(timestamp) {
        const age = Date.now() - timestamp.getTime();
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
        return Math.max(0, Math.min(1, 1 - age / maxAge));
    }
    calculateSampleSizeAdequacy(data) {
        const minSamples = 50; // Minimum number of samples for good quality
        const optimalSamples = 200; // Optimal number of samples
        const sampleCount = data.timeBlocks.length;
        if (sampleCount >= optimalSamples)
            return 1;
        if (sampleCount <= minSamples)
            return 0;
        return (sampleCount - minSamples) / (optimalSamples - minSamples);
    }
}
//# sourceMappingURL=BaseAIModel.js.map