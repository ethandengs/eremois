import { z } from 'zod';
export const TaskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);
export const TaskStatusSchema = z.enum(['todo', 'in_progress', 'completed', 'cancelled']);
export const TaskSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1),
    description: z.string().optional(),
    priority: TaskPrioritySchema,
    status: TaskStatusSchema,
    dueDate: z.date().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    tags: z.array(z.string()),
    parentId: z.string().uuid().optional(),
    subTasks: z.array(z.string().uuid()).optional(),
});
//# sourceMappingURL=types.js.map