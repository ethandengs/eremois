import React from 'react';
interface TimeCircleProps {
    tasks: Array<{
        id: string;
        title: string;
        startTime: Date;
        duration: number;
        color?: string;
    }>;
}
export declare const TimeCircle: React.FC<TimeCircleProps>;
export {};
