import React, { useEffect, useRef } from 'react';
import { motion, SVGMotionProps } from 'framer-motion';
import type { TimeBlock } from '@eremois/core';

interface CircularTimelineProps {
  blocks: TimeBlock[];
  currentTime: Date;
  onBlockClick?: (block: TimeBlock) => void;
  size?: number;
}

interface SVGElements extends SVGMotionProps<SVGPathElement> {
  d: string;
  stroke: string;
  strokeWidth: string;
  fill: string;
}

export const CircularTimeline: React.FC<CircularTimelineProps> = ({
  blocks,
  currentTime,
  onBlockClick,
  size = 400,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const center = size / 2;
  const radius = (size - 40) / 2;

  useEffect(() => {
    if (!svgRef.current) return;
    // Setup any necessary D3 or SVG manipulations
  }, [blocks, currentTime, size]);

  const getBlockArc = (block: TimeBlock): string => {
    const startHours = block.startTime.getHours() + block.startTime.getMinutes() / 60;
    const endHours = block.endTime.getHours() + block.endTime.getMinutes() / 60;
    
    const startAngle = (startHours / 24) * 2 * Math.PI - Math.PI / 2;
    const endAngle = (endHours / 24) * 2 * Math.PI - Math.PI / 2;
    
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    
    const largeArcFlag = endHours - startHours > 12 ? 1 : 0;
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  const getBlockColor = (block: TimeBlock): string => {
    switch (block.type) {
      case 'FOCUS':
        return '#4CAF50';
      case 'BREAK':
        return '#2196F3';
      case 'MEETING':
        return '#F44336';
      case 'TASK':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const getCurrentTimeIndicator = (): { x: number; y: number } => {
    const hours = currentTime.getHours() + currentTime.getMinutes() / 60;
    const angle = (hours / 24) * 2 * Math.PI - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    
    return { x, y };
  };

  const hourMarkers = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 2 * Math.PI - Math.PI / 2;
    return (
      <line
        key={`hour-${i}`}
        x1={center + (radius - 10) * Math.cos(angle)}
        y1={center + (radius - 10) * Math.sin(angle)}
        x2={center + radius * Math.cos(angle)}
        y2={center + radius * Math.sin(angle)}
        stroke="#BDBDBD"
        strokeWidth="2"
      />
    );
  });

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="circular-timeline"
      role="img"
      aria-label="Circular Timeline"
    >
      {/* Base circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#E0E0E0"
        strokeWidth="2"
      />

      {/* Hour markers */}
      {hourMarkers}

      {/* Time blocks */}
      {blocks.map((block: TimeBlock) => (
        <motion.path
          key={block.id}
          d={getBlockArc(block)}
          stroke={getBlockColor(block)}
          strokeWidth="8"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => onBlockClick?.(block)}
          className="time-block"
          whileHover={{ scale: 1.05 }}
        />
      ))}

      {/* Current time indicator */}
      <motion.circle
        cx={getCurrentTimeIndicator().x}
        cy={getCurrentTimeIndicator().y}
        r="6"
        fill="#E91E63"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </svg>
  );
}; 