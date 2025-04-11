import React from 'react';
interface Task {
    id: string;
    title: string;
    startTime: Date;
    duration: number;
    color?: string;
    description?: string;
}
interface TaskFormProps {
    initialTask?: Task;
    onSubmit: (task: Omit<Task, 'id'>) => void;
    onCancel: () => void;
}
export declare const TaskForm: React.FC<TaskFormProps>;
export {};
