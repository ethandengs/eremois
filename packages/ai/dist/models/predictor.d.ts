import type { TimeBlock, PredictionInput, UserPattern } from './types';
export declare class SchedulePredictor {
    private model;
    private userPattern;
    initialize(userPattern: UserPattern): Promise<void>;
    private createModel;
    private loadOrTrainModel;
    private trainModel;
    private prepareTrainingData;
    predictNextBlock(input: PredictionInput): Promise<TimeBlock>;
    private preparePredictionInput;
    private convertToBlockType;
}
//# sourceMappingURL=predictor.d.ts.map