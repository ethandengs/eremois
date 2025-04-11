import React, { useState } from 'react';
import { motion } from 'framer-motion';

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

const colors = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#FF4B4B', // red (updated to match website)
  '#8B5CF6', // purple
  '#EC4899', // pink
];

export const TaskForm: React.FC<TaskFormProps> = ({
  initialTask,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [startTime, setStartTime] = useState(
    initialTask?.startTime
      ? new Date(initialTask.startTime).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [duration, setDuration] = useState(initialTask?.duration || 30);
  const [color, setColor] = useState(initialTask?.color || colors[3]); // Default to red
  const [description, setDescription] = useState(initialTask?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      startTime: new Date(startTime),
      duration,
      color,
      description,
    });
  };

  const inputClasses = "mt-1 block w-full rounded-xl bg-gray-700/50 border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#FF4B4B] text-base py-2 px-3";
  const labelClasses = "block text-base font-medium text-gray-300 mb-2";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="title" className={labelClasses}>
          Task Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClasses}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className={labelClasses}>
            Start Time
          </label>
          <input
            type="datetime-local"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label htmlFor="duration" className={labelClasses}>
            Duration (minutes)
          </label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min="5"
            max="1440"
            step="5"
            className={inputClasses}
            required
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>
          Color
        </label>
        <div className="flex space-x-3">
          {colors.map((c) => (
            <motion.button
              key={c}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setColor(c)}
              className={`w-10 h-10 rounded-xl transition-all ${
                color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClasses}>
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={inputClasses}
        />
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="px-6 py-2 rounded-xl text-base font-medium text-white bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 rounded-xl text-base font-medium text-white bg-[#FF4B4B] hover:bg-[#FF6B6B] transition-colors"
        >
          {initialTask ? 'Update Task' : 'Add Task'}
        </motion.button>
      </div>
    </motion.form>
  );
}; 