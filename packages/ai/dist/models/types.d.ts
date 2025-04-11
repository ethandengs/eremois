import { z } from 'zod';
export declare const TimeBlockSchema: z.ZodObject<{
    id: z.ZodString;
    start: z.ZodDate;
    end: z.ZodDate;
    type: z.ZodEnum<["FOCUS", "BREAK", "MEETING", "TASK"]>;
    energy: z.ZodNumber;
    productivity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    start: Date;
    end: Date;
    type: "FOCUS" | "BREAK" | "MEETING" | "TASK";
    energy: number;
    productivity: number;
}, {
    id: string;
    start: Date;
    end: Date;
    type: "FOCUS" | "BREAK" | "MEETING" | "TASK";
    energy: number;
    productivity: number;
}>;
export declare const UserPatternSchema: z.ZodObject<{
    preferredWorkingHours: z.ZodArray<z.ZodNumber, "many">;
    energyPattern: z.ZodRecord<z.ZodString, z.ZodNumber>;
    taskPreferences: z.ZodRecord<z.ZodString, z.ZodNumber>;
    breakPatterns: z.ZodArray<z.ZodNumber, "many">;
    focusSessionLength: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    preferredWorkingHours: number[];
    energyPattern: Record<string, number>;
    taskPreferences: Record<string, number>;
    breakPatterns: number[];
    focusSessionLength: number;
}, {
    preferredWorkingHours: number[];
    energyPattern: Record<string, number>;
    taskPreferences: Record<string, number>;
    breakPatterns: number[];
    focusSessionLength: number;
}>;
export declare const PredictionInputSchema: z.ZodObject<{
    timeOfDay: z.ZodNumber;
    dayOfWeek: z.ZodNumber;
    previousBlocks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        start: z.ZodDate;
        end: z.ZodDate;
        type: z.ZodEnum<["FOCUS", "BREAK", "MEETING", "TASK"]>;
        energy: z.ZodNumber;
        productivity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        start: Date;
        end: Date;
        type: "FOCUS" | "BREAK" | "MEETING" | "TASK";
        energy: number;
        productivity: number;
    }, {
        id: string;
        start: Date;
        end: Date;
        type: "FOCUS" | "BREAK" | "MEETING" | "TASK";
        energy: number;
        productivity: number;
    }>, "many">;
    currentEnergy: z.ZodNumber;
    pendingTasks: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    timeOfDay: number;
    dayOfWeek: number;
    previousBlocks: {
        id: string;
        start: Date;
        end: Date;
        type: "FOCUS" | "BREAK" | "MEETING" | "TASK";
        energy: number;
        productivity: number;
    }[];
    currentEnergy: number;
    pendingTasks: string[];
}, {
    timeOfDay: number;
    dayOfWeek: number;
    previousBlocks: {
        id: string;
        start: Date;
        end: Date;
        type: "FOCUS" | "BREAK" | "MEETING" | "TASK";
        energy: number;
        productivity: number;
    }[];
    currentEnergy: number;
    pendingTasks: string[];
}>;
export type TimeBlock = z.infer<typeof TimeBlockSchema>;
export type UserPattern = z.infer<typeof UserPatternSchema>;
export type PredictionInput = z.infer<typeof PredictionInputSchema>;
//# sourceMappingURL=types.d.ts.map