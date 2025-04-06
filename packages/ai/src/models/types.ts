import { z } from "zod";

export const TimeBlockSchema = z.object({
  id: z.string(),
  start: z.date(),
  end: z.date(),
  type: z.enum(["FOCUS", "BREAK", "MEETING", "TASK"]),
  energy: z.number().min(0).max(1),
  productivity: z.number().min(0).max(1),
});

export const UserPatternSchema = z.object({
  preferredWorkingHours: z.array(z.number()),
  energyPattern: z.record(z.string(), z.number()),
  taskPreferences: z.record(z.string(), z.number()),
  breakPatterns: z.array(z.number()),
  focusSessionLength: z.number(),
});

export const PredictionInputSchema = z.object({
  timeOfDay: z.number(),
  dayOfWeek: z.number(),
  previousBlocks: z.array(TimeBlockSchema),
  currentEnergy: z.number(),
  pendingTasks: z.array(z.string()),
});

export type TimeBlock = z.infer<typeof TimeBlockSchema>;
export type UserPattern = z.infer<typeof UserPatternSchema>;
export type PredictionInput = z.infer<typeof PredictionInputSchema>;
