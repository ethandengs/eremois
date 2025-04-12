import type { TimeBlock, UserPattern } from '../types';
import type { Task } from '../tasks/types';
import type { StorageAdapter, StorageData } from '../storage/types';

// Define base interface for entities that can be synced
interface BaseSyncEntity {
  id: string;
  updatedAt: Date | number;
  createdAt: Date | number;
}

// Type guard functions
function isTask(entity: BaseSyncEntity): entity is TaskSync {
  return 'title' in entity && 'priority' in entity && 'status' in entity;
}

function isTimeBlock(entity: BaseSyncEntity): entity is TimeBlockSync {
  return 'startTime' in entity && 'endTime' in entity && 'type' in entity;
}

function isUserPattern(entity: BaseSyncEntity): entity is UserPatternSync {
  return 'preferences' in entity;
}

// Convert Date to number for storage
function convertDatesToNumbers<T extends BaseSyncEntity>(entity: T): T {
  const converted = { ...entity };
  if (converted.updatedAt instanceof Date) {
    converted.updatedAt = converted.updatedAt.getTime();
  }
  if (converted.createdAt instanceof Date) {
    converted.createdAt = converted.createdAt.getTime();
  }
  return converted;
}

// Define specific sync entity types
type TaskSync = Task & BaseSyncEntity;
type TimeBlockSync = TimeBlock & BaseSyncEntity;
type UserPatternSync = UserPattern & BaseSyncEntity;

export type SyncEntity = TaskSync | TimeBlockSync | UserPatternSync;
export type StorageKey = keyof Pick<StorageData, 'tasks' | 'timeBlocks' | 'userPattern'>;

export interface SyncOperation {
  type: 'create' | 'update' | 'delete';
  entityType: StorageKey;
  entityId: string;
  data?: SyncEntity;
  timestamp: number;
}

export interface SyncPeer {
  id: string;
  lastSyncTime: number;
  isConnected: boolean;
}

export class SyncManager {
  private pendingOperations: SyncOperation[] = [];

  constructor(private readonly storage: StorageAdapter) {}

  async mergeData(serverData: Partial<StorageData>): Promise<void> {
    const localTasks = (await this.storage.get('tasks')) ?? [];
    const localTimeBlocks = (await this.storage.get('timeBlocks')) ?? [];
    const localUserPattern = await this.storage.get('userPattern');

    if (Array.isArray(serverData.tasks)) {
      const convertedTasks = serverData.tasks.map(task => convertDatesToNumbers(task as TaskSync));
      const mergedTasks = this.mergeEntities(localTasks as TaskSync[], convertedTasks);
      await this.storage.set('tasks', mergedTasks);
    }

    if (Array.isArray(serverData.timeBlocks)) {
      const convertedTimeBlocks = serverData.timeBlocks.map(block => convertDatesToNumbers(block as TimeBlockSync));
      const mergedTimeBlocks = this.mergeEntities(localTimeBlocks as TimeBlockSync[], convertedTimeBlocks);
      await this.storage.set('timeBlocks', mergedTimeBlocks);
    }

    if (serverData.userPattern) {
      const convertedPattern = convertDatesToNumbers(serverData.userPattern as UserPatternSync);
      if (!localUserPattern || convertedPattern.updatedAt > (localUserPattern as UserPatternSync).updatedAt) {
        await this.storage.set('userPattern', convertedPattern);
      }
    }
  }

  private mergeEntities<T extends BaseSyncEntity>(local: T[], server: T[]): T[] {
    const merged = [...local];
    
    for (const serverEntity of server) {
      const localIndex = merged.findIndex(e => e.id === serverEntity.id);
      
      if (localIndex === -1) {
        merged.push(serverEntity);
      } else {
        const localEntity = merged[localIndex];
        const serverTime = typeof serverEntity.updatedAt === 'number' ? serverEntity.updatedAt : serverEntity.updatedAt.getTime();
        const localTime = typeof localEntity.updatedAt === 'number' ? localEntity.updatedAt : localEntity.updatedAt.getTime();
        
        if (serverTime > localTime) {
          merged[localIndex] = serverEntity;
        }
      }
    }

    return merged;
  }

  async applyOperation(operation: SyncOperation): Promise<void> {
    this.pendingOperations.push(operation);
    await this.storage.set('pendingOperations', this.pendingOperations);

    switch (operation.type) {
      case 'create':
      case 'update': {
        if (!operation.data) break;
        
        const currentData = await this.storage.get(operation.entityType) ?? 
          (operation.entityType === 'userPattern' ? null : []);
        
        if (operation.entityType === 'userPattern') {
          if (isUserPattern(operation.data)) {
            await this.storage.set('userPattern', operation.data);
          }
        } else if (operation.entityType === 'tasks') {
          const entities = currentData as TaskSync[];
          if (isTask(operation.data)) {
            const index = entities.findIndex(e => e.id === operation.entityId);
            if (index === -1) {
              entities.push(operation.data);
            } else {
              entities[index] = operation.data;
            }
            await this.storage.set('tasks', entities);
          }
        } else if (operation.entityType === 'timeBlocks') {
          const entities = currentData as TimeBlockSync[];
          if (isTimeBlock(operation.data)) {
            const index = entities.findIndex(e => e.id === operation.entityId);
            if (index === -1) {
              entities.push(operation.data);
            } else {
              entities[index] = operation.data;
            }
            await this.storage.set('timeBlocks', entities);
          }
        }
        break;
      }
      
      case 'delete': {
        const currentData = await this.storage.get(operation.entityType);
        
        if (operation.entityType === 'userPattern') {
          await this.storage.set('userPattern', null);
        } else if (operation.entityType === 'tasks') {
          const entities = currentData as TaskSync[];
          const filtered = entities.filter(e => e.id !== operation.entityId);
          await this.storage.set('tasks', filtered);
        } else if (operation.entityType === 'timeBlocks') {
          const entities = currentData as TimeBlockSync[];
          const filtered = entities.filter(e => e.id !== operation.entityId);
          await this.storage.set('timeBlocks', filtered);
        }
        break;
      }
    }
  }

  async getPendingOperations(): Promise<SyncOperation[]> {
    return this.pendingOperations;
  }

  async clearPendingOperations(): Promise<void> {
    this.pendingOperations = [];
    await this.storage.set('pendingOperations', []);
  }
}