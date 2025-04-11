import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

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

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskComplete,
  onTaskClick,
}) => {
  const sortedTasks = [...tasks].sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime()
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Today's Tasks
      </h2>
      <AnimatePresence>
        {sortedTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`
              bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 
              border-l-4 cursor-pointer
              ${task.completed ? 'border-green-500' : 'border-blue-500'}
              hover:shadow-md transition-all
            `}
            style={{ borderLeftColor: task.color }}
            onClick={() => onTaskClick(task)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className={`text-lg font-medium ${
                  task.completed 
                    ? 'text-gray-500 dark:text-gray-400 line-through' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {format(task.startTime, 'HH:mm')} - {format(
                    new Date(task.startTime.getTime() + task.duration * 60000),
                    'HH:mm'
                  )}
                </p>
                {task.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {task.description}
                  </p>
                )}
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskComplete(task.id);
                }}
                className={`
                  ml-4 p-2 rounded-full
                  ${task.completed
                    ? 'bg-green-100 dark:bg-green-900 text-green-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}
                  hover:bg-opacity-80 transition-colors
                `}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}; 