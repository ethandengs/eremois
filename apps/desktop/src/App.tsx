import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimeCircle } from './components/TimeCircle/TimeCircle';
import { TaskList } from './components/Tasks/TaskList';
import { TaskForm } from './components/Tasks/TaskForm';

interface Task {
  id: string;
  title: string;
  startTime: Date;
  duration: number;
  color?: string;
  description?: string;
  completed?: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setIsAddingTask(false);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id'>) => {
    if (!selectedTask) return;
    const updatedTasks = tasks.map((task) =>
      task.id === selectedTask.id ? { ...task, ...taskData } : task
    );
    setTasks(updatedTasks);
    setSelectedTask(null);
  };

  const handleTaskComplete = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <header className="flex items-center justify-between p-6 bg-[#111111]/80 backdrop-blur-lg">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tight">eremois</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddingTask(true)}
          className="bg-[#FF4B4B] px-6 py-2 rounded-xl font-medium hover:bg-[#FF6B6B] transition-colors"
        >
          Add New Task
        </motion.button>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 p-6">
        <div className="lg:w-1/2 flex flex-col items-center">
          <div className="w-full aspect-square bg-gray-800/50 rounded-3xl p-8 flex items-center justify-center">
            <TimeCircle tasks={tasks} />
          </div>
        </div>

        <div className="lg:w-1/2">
          <h2 className="text-2xl font-bold mb-6 tracking-tight">Today's Tasks</h2>
          <div className="bg-gray-800/50 rounded-3xl p-6">
            <TaskList
              tasks={tasks}
              onTaskComplete={handleTaskComplete}
              onTaskClick={handleTaskClick}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(isAddingTask || selectedTask) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#111111]/95 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={() => {
              setIsAddingTask(false);
              setSelectedTask(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-gray-800/50 rounded-3xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <TaskForm
                initialTask={selectedTask || undefined}
                onSubmit={selectedTask ? handleUpdateTask : handleAddTask}
                onCancel={() => {
                  setIsAddingTask(false);
                  setSelectedTask(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App; 