import React from 'react';
interface Task {
    id: string;
    title: string;
    startTime: Date;
    duration: number;
    color?: string;
    description?: string;
    completed?: boolean;
}
interface TaskListProps {
    tasks: Task[];
    onTaskComplete: (taskId: string) => void;
    onTaskClick: (task: Task) => void;
}
export declare const TaskList: React.FC<TaskListProps>;
export {};
