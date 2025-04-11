import type { TimeBlock } from '../types';
import type { Task } from '../tasks/types';
import type { UserPattern } from '../types';
import type { EncryptionManager, EncryptedData } from '../storage/encrypted/EncryptionManager';
import type { StorageAdapter } from '../storage/types';
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
export declare class SyncManager {
    private deviceId;
    private version;
    private peers;
    private pendingOperations;
    private readonly storage;
    private readonly encryptionManager;
    constructor(storage: StorageAdapter, encryptionManager: EncryptionManager, deviceId: string);
    addPeer(peer: SyncPeer): Promise<void>;
    removePeer(peerId: string): Promise<void>;
    prepareDataForSync(): Promise<EncryptedData>;
    processSyncData(encryptedData: EncryptedData): Promise<void>;
    private mergeData;
    private mergeEntities;
    recordOperation(operation: Omit<SyncOperation, 'metadata'>): Promise<void>;
    getPendingOperations(): Promise<SyncOperation[]>;
    clearPendingOperations(): Promise<void>;
    resolveConflict(conflict: ConflictResolution): Promise<void>;
    private applyOperation;
    getConnectedPeers(): SyncPeer[];
    updatePeerLastSeen(peerId: string): Promise<void>;
}
//# sourceMappingURL=SyncManager.d.ts.map