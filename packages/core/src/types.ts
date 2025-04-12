export type BlockType = 'FOCUS' | 'BREAK' | 'MEETING' | 'TASK';

export interface TimeBlock {
  id: string;
  type: BlockType;
  startTime: Date;
  endTime: Date;
  title?: string;
  description?: string;
  color?: string;
  updatedAt: Date;
}

export interface UserPattern {
  id: string;
  preferredFocusDuration: number;
  preferredBreakDuration: number;
  productivePeriods: {
    dayOfWeek: number;
    startHour: number;
    endHour: number;
  }[];
  meetingPreferences: {
    preferredDays: number[];
    preferredHours: number[];
  };
  updatedAt: Date;
}

export interface PredictionInput {
  currentTime: Date;
  previousBlocks: TimeBlock[];
  userPattern: UserPattern;
}

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
}

export interface Plugin {
  metadata: PluginMetadata;
  onBlockCreate?: (block: TimeBlock) => Promise<void>;
  onBlockUpdate?: (block: TimeBlock) => Promise<void>;
  onBlockDelete?: (blockId: string) => Promise<void>;
  onTimelineUpdate?: (blocks: TimeBlock[]) => Promise<void>;
} 