import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';

interface TimeCircleProps {
  tasks: Array<{
    id: string;
    title: string;
    startTime: Date;
    duration: number; // in minutes
    color?: string;
  }>;
}

type TimeView = 'upcoming' | 'past' | 'today';

export const TimeCircle: React.FC<TimeCircleProps> = ({ tasks }) => {
  const [now, setNow] = useState(new Date());
  const [timeView, setTimeView] = useState<TimeView>('today');
  const radius = 200;
  const circumference = 2 * Math.PI * radius;
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentAngle = ((currentHour * 60 + currentMinute) / (24 * 60)) * 360;

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Filter tasks based on time view
  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.startTime);
    const today = startOfDay(now);
    
    switch (timeView) {
      case 'upcoming':
        return isAfter(taskDate, now);
      case 'past':
        return isBefore(taskDate, today);
      case 'today':
        return (
          isAfter(taskDate, today) &&
          isBefore(taskDate, new Date(today.setDate(today.getDate() + 1)))
        );
      default:
        return true;
    }
  });

  const viewOptions: { value: TimeView; label: string }[] = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'today', label: 'Today' },
    { value: 'past', label: 'Past' },
  ];

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Time View Switcher */}
      <div className="flex bg-gray-800/50 rounded-xl p-1">
        {viewOptions.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => setTimeView(option.value)}
            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              timeView === option.value
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {timeView === option.value && (
              <motion.div
                layoutId="activeView"
                className="absolute inset-0 bg-[#FF4B4B] rounded-lg"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="relative w-[500px] h-[500px]">
        {/* Base circle */}
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 500 500"
        >
          {/* Hour markers */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * 360;
            const isCurrentHour = i === currentHour;
            const markerLength = circumference / 24; // Use circumference for marker length
            return (
              <motion.line
                key={i}
                x1={250 + (radius - markerLength * 0.1) * Math.cos((angle * Math.PI) / 180)}
                y1={250 + (radius - markerLength * 0.1) * Math.sin((angle * Math.PI) / 180)}
                x2={250 + radius * Math.cos((angle * Math.PI) / 180)}
                y2={250 + radius * Math.sin((angle * Math.PI) / 180)}
                stroke={isCurrentHour ? '#FF4B4B' : '#4A5568'}
                strokeWidth={isCurrentHour ? 3 : 1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              />
            );
          })}

          {/* Current time indicator */}
          <motion.line
            x1="250"
            y1="250"
            x2={250 + (radius - 10) * Math.cos((currentAngle * Math.PI) / 180)}
            y2={250 + (radius - 10) * Math.sin((currentAngle * Math.PI) / 180)}
            stroke="#FF4B4B"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Task arcs */}
          <AnimatePresence mode="wait">
            {filteredTasks.map((task) => {
              const startMinutes = task.startTime.getHours() * 60 + task.startTime.getMinutes();
              const startAngle = (startMinutes / (24 * 60)) * 360;
              const sweepAngle = (task.duration / (24 * 60)) * 360;

              return (
                <motion.path
                  key={task.id}
                  d={`
                    M ${250 + radius * Math.cos((startAngle * Math.PI) / 180)} 
                      ${250 + radius * Math.sin((startAngle * Math.PI) / 180)}
                    A ${radius} ${radius} 0 ${sweepAngle > 180 ? 1 : 0} 1 
                      ${250 + radius * Math.cos(((startAngle + sweepAngle) * Math.PI) / 180)}
                      ${250 + radius * Math.sin(((startAngle + sweepAngle) * Math.PI) / 180)}
                  `}
                  stroke={task.color || '#FF4B4B'}
                  strokeWidth="30"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="cursor-pointer hover:brightness-110 transition-all"
                />
              );
            })}
          </AnimatePresence>
        </svg>

        {/* Center time display */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="text-4xl font-bold tracking-tight"
          >
            {format(now, 'HH:mm')}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-gray-400 mt-2"
          >
            {format(now, 'EEEE, MMM d')}
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 