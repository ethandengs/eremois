import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, typography } from '../theme';

interface TimeBlock {
  id: string;
  startHour: number;
  endHour: number;
  color: string;
}

interface TimeBlockPath {
  id: string;
  color: string;
  path: string;
}

interface CircularTimelineProps {
  timeBlocks: TimeBlock[];
  currentHour: number;
  currentMinute: number;
  remainingTime?: string;
  currentTask?: string;
  nextTask?: string;
  style?: ViewStyle;
}

const RADIUS = 120;
const CENTER = RADIUS + 20;
const STROKE_WIDTH = 20;
const CIRCLE_LENGTH = 2 * Math.PI * RADIUS;

export const CircularTimeline: React.FC<CircularTimelineProps> = ({
  timeBlocks,
  currentHour,
  currentMinute,
  remainingTime,
  currentTask,
  nextTask,
  style,
}: CircularTimelineProps) => {
  const timeBlockPaths = useMemo(() => {
    return timeBlocks.map((block: TimeBlock): TimeBlockPath => {
      const startAngle = ((block.startHour % 12) / 12) * 2 * Math.PI - Math.PI / 2;
      const endAngle = ((block.endHour % 12) / 12) * 2 * Math.PI - Math.PI / 2;

      const startX = CENTER + RADIUS * Math.cos(startAngle);
      const startY = CENTER + RADIUS * Math.sin(startAngle);
      const endX = CENTER + RADIUS * Math.cos(endAngle);
      const endY = CENTER + RADIUS * Math.sin(endAngle);

      const largeArcFlag = block.endHour - block.startHour > 6 ? 1 : 0;

      return {
        id: block.id,
        color: block.color,
        path: `M ${startX} ${startY} A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      };
    });
  }, [timeBlocks]);

  const currentTimePosition = useMemo(() => {
    const angle = ((currentHour % 12 + currentMinute / 60) / 12) * 2 * Math.PI - Math.PI / 2;
    return {
      x: CENTER + RADIUS * Math.cos(angle),
      y: CENTER + RADIUS * Math.sin(angle),
    };
  }, [currentHour, currentMinute]);

  return (
    <View style={[styles.container, style]}>
      <Svg width={CENTER * 2} height={CENTER * 2}>
        {/* Base circle */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke={colors.surface}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />

        {/* Time blocks */}
        {timeBlockPaths.map(({ id, path, color }: TimeBlockPath) => (
          <Path
            key={id}
            d={path}
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
        ))}

        {/* Current time indicator */}
        <Circle
          cx={currentTimePosition.x}
          cy={currentTimePosition.y}
          r={4}
          fill={colors.text}
        />
      </Svg>

      {/* Center content */}
      <View style={styles.centerContent}>
        {remainingTime && (
          <>
            <Text style={styles.remainingTime}>{remainingTime}</Text>
            <Text style={styles.remainingLabel}>remain</Text>
          </>
        )}
        {currentTask && (
          <Text style={styles.currentTask}>{currentTask}</Text>
        )}
        {nextTask && (
          <>
            <Text style={styles.nextLabel}>next</Text>
            <Text style={styles.nextTask}>{nextTask}</Text>
          </>
        )}
      </View>

      {/* Hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x = CENTER + (RADIUS + 15) * Math.cos(angle);
        const y = CENTER + (RADIUS + 15) * Math.sin(angle);
        return (
          <View
            key={`hour-${i}`}
            style={[
              styles.hourMarker,
              {
                transform: [
                  { translateX: x - 1 },
                  { translateY: y - 8 },
                ],
              },
            ]}
          >
            <Text style={styles.hourText}>{i === 0 ? '12' : i}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CENTER * 2,
    height: CENTER * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  remainingTime: {
    ...typography.h1,
    color: colors.text,
  },
  remainingLabel: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  currentTask: {
    ...typography.body,
    color: colors.text,
    marginBottom: 8,
  },
  nextLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  nextTask: {
    ...typography.body,
    color: colors.text,
  },
  hourMarker: {
    position: 'absolute',
    width: 2,
    alignItems: 'center',
  },
  hourText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
}); 