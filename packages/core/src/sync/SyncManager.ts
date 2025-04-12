import type { TimeBlock } from '../types';
import type { Task } from '../tasks/types';
import type { UserPattern } from '../types';
import type { EncryptionManager, EncryptedData } from '../storage/encrypted/EncryptionManager';
import type { StorageAdapter, StorageData } from '../storage/types';

export interface SyncPeer {
  id: string;
  name: string;
  lastSeen: Date;
}

export interface SyncMetadata {
  timestamp: number;
  deviceId: string;
  version: number;
}

export interface SyncableData {
  tasks: Task[];
  timeBlocks: TimeBlock[];
  userPattern: UserPattern | null;
}

export interface SyncOperation {
  type: 'create' | 'update' | 'delete';
  entityType: 'task' | 'timeBlock' | 'userPattern';
  entityId: string;
  data?: any;
  metadata: SyncMetadata;
}

export interface ConflictResolution {
  operation: SyncOperation;
  resolution: 'local' | 'remote' | 'merge';
  mergedData?: any;
}

type SyncEntity = Task | TimeBlock | UserPattern;
type StorageKey = keyof StorageData;

export class SyncManager {
  private deviceId: string;
  private version: number = 1;
  private peers: Map<string, SyncPeer> = new Map();
  private pendingOperations: SyncOperation[] = [];
  private readonly storage: StorageAdapter;
  private readonly encryptionManager: EncryptionManager;

  constructor(
    storage: StorageAdapter,
    encryptionManager: EncryptionManager,
    deviceId: string
  ) {
    this.storage = storage;
    this.encryptionManager = encryptionManager;
    this.deviceId = deviceId;
  }

  async addPeer(peer: SyncPeer): Promise<void> {
    this.peers.set(peer.id, {
      ...peer,
      lastSeen: new Date(),
    });
  }

  async removePeer(peerId: string): Promise<void> {
    this.peers.delete(peerId);
  }

  async prepareDataForSync(): Promise<EncryptedData> {
    const data: SyncableData = {
      tasks: await this.storage.get('tasks') || [],
      timeBlocks: await this.storage.get('timeBlocks') || [],
      userPattern: await this.storage.get('userPattern'),
    };

    return this.encryptionManager.encrypt(data);
  }

  async processSyncData(encryptedData: EncryptedData): Promise<void> {
    const data = await this.encryptionManager.decrypt(encryptedData) as SyncableData;
    await this.mergeData(data);
  }

  private async mergeData(remoteData: SyncableData): Promise<void> {
    // Merge tasks
    const localTasks = await this.storage.get('tasks');
    const mergedTasks = this.mergeEntities<Task>(localTasks, remoteData.tasks);
    await this.storage.set('tasks', mergedTasks);

    // Merge time blocks
    const localBlocks = await this.storage.get('timeBlocks');
    const mergedBlocks = this.mergeEntities<TimeBlock>(localBlocks, remoteData.timeBlocks);
    await this.storage.set('timeBlocks', mergedBlocks);

    // Merge user pattern (take most recent)
    const localPattern = await this.storage.get('userPattern');
    if (remoteData.userPattern && (!localPattern || 
        new Date(remoteData.userPattern.updatedAt) > new Date(localPattern.updatedAt))) {
      await this.storage.set('userPattern', remoteData.userPattern);
    }
  }

  private mergeEntities<T extends SyncEntity>(local: T[], remote: T[]): T[] {
    const merged = new Map<string, T>();
    
    // Index local entities
    for (const entity of local) {
      merged.set(entity.id, entity);
    }

    // Merge remote entities
    for (const remoteEntity of remote) {
      const localEntity = merged.get(remoteEntity.id);
      
      if (!localEntity) {
        merged.set(remoteEntity.id, remoteEntity);
      } else {
        const remoteDate = new Date(remoteEntity.updatedAt);
        const localDate = new Date(localEntity.updatedAt);
        
        if (remoteDate > localDate) {
          merged.set(remoteEntity.id, remoteEntity);
        }
      }
    }

    return Array.from(merged.values());
  }

  async recordOperation(operation: Omit<SyncOperation, 'metadata'>): Promise<void> {
    const syncOperation: SyncOperation = {
      ...operation,
      metadata: {
        timestamp: Date.now(),
        deviceId: this.deviceId,
        version: this.version,
      },
    };

    this.pendingOperations.push(syncOperation);
    await this.storage.set('pendingOperations', this.pendingOperations);
  }

  async getPendingOperations(): Promise<SyncOperation[]> {
    return this.pendingOperations;
  }

  async clearPendingOperations(): Promise<void> {
    this.pendingOperations = [];
    await this.storage.set('pendingOperations', []);
  }

  async resolveConflict(conflict: ConflictResolution): Promise<void> {
    switch (conflict.resolution) {
      case 'local':
        // Keep local version, no action needed
        break;
      case 'remote':
        // Apply remote operation
        await this.applyOperation(conflict.operation);
        break;
      case 'merge':
        if (conflict.mergedData) {
          await this.applyOperation({
            ...conflict.operation,
            data: conflict.mergedData,
          });
        }
        break;
    }
  }

  private async applyOperation(operation: SyncOperation): Promise<void> {
    const { entityType, type, entityId, data } = operation;
    const storageKey = `${entityType}s` as StorageKey;
    let entities = await this.storage.get(storageKey);

    if (Array.isArray(entities)) {
      switch (type) {
        case 'create':
        case 'update': {
          const index = entities.findIndex(e => e.id === entityId);
          
          if (index === -1) {
            entities.push(data);
          } else {
            entities[index] = data;
          }
          
          await this.storage.set(storageKey, entities);
          break;
        }
        case 'delete': {
          entities = entities.filter(e => e.id !== entityId);
          await this.storage.set(storageKey, entities);
          break;
        }
      }
    }
  }

  getConnectedPeers(): SyncPeer[] {
    return Array.from(this.peers.values());
  }

  async updatePeerLastSeen(peerId: string): Promise<void> {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.lastSeen = new Date();
    }
  }
} 