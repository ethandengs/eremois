import { z } from 'zod';
export declare const TaskPrioritySchema: z.ZodEnum<["low", "medium", "high", "urgent"]>;
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;
export declare const TaskStatusSchema: z.ZodEnum<["todo", "in_progress", "completed", "cancelled"]>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export declare const TaskSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    priority: z.ZodEnum<["low", "medium", "high", "urgent"]>;
    status: z.ZodEnum<["todo", "in_progress", "completed", "cancelled"]>;
    dueDate: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    tags: z.ZodArray<z.ZodString, "many">;
    parentId: z.ZodOptional<z.ZodString>;
    subTasks: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "todo" | "in_progress" | "completed" | "cancelled";
    id: string;
    title: string;
    priority: "low" | "medium" | "high" | "urgent";
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    description?: string | undefined;
    dueDate?: Date | undefined;
    parentId?: string | undefined;
    subTasks?: string[] | undefined;
}, {
    status: "todo" | "in_progress" | "completed" | "cancelled";
    id: string;
    title: string;
    priority: "low" | "medium" | "high" | "urgent";
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    description?: string | undefined;
    dueDate?: Date | undefined;
    parentId?: string | undefined;
    subTasks?: string[] | undefined;
}>;
export type Task = z.infer<typeof TaskSchema>;
//# sourceMappingURL=types.d.ts.map