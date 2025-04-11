export class SyncManager {
    constructor(storage, encryptionManager, deviceId) {
        this.version = 1;
        this.peers = new Map();
        this.pendingOperations = [];
        this.storage = storage;
        this.encryptionManager = encryptionManager;
        this.deviceId = deviceId;
    }
    async addPeer(peer) {
        this.peers.set(peer.id, {
            ...peer,
            lastSeen: new Date(),
        });
    }
    async removePeer(peerId) {
        this.peers.delete(peerId);
    }
    async prepareDataForSync() {
        const data = {
            tasks: await this.storage.get('tasks') || [],
            timeBlocks: await this.storage.get('timeBlocks') || [],
            userPattern: await this.storage.get('userPattern'),
        };
        return this.encryptionManager.encrypt(data);
    }
    async processSyncData(encryptedData) {
        const data = await this.encryptionManager.decrypt(encryptedData);
        await this.mergeData(data);
    }
    async mergeData(remoteData) {
        // Merge tasks
        const localTasks = await this.storage.get('tasks') || [];
        const mergedTasks = this.mergeEntities(localTasks, remoteData.tasks);
        await this.storage.set('tasks', mergedTasks);
        // Merge time blocks
        const localBlocks = await this.storage.get('timeBlocks') || [];
        const mergedBlocks = this.mergeEntities(localBlocks, remoteData.timeBlocks);
        await this.storage.set('timeBlocks', mergedBlocks);
        // Merge user pattern (take most recent)
        const localPattern = await this.storage.get('userPattern');
        if (remoteData.userPattern && (!localPattern ||
            new Date(remoteData.userPattern.updatedAt) > new Date(localPattern.updatedAt))) {
            await this.storage.set('userPattern', remoteData.userPattern);
        }
    }
    mergeEntities(local, remote) {
        const merged = new Map();
        // Index local entities
        for (const entity of local) {
            merged.set(entity.id, entity);
        }
        // Merge remote entities
        for (const remoteEntity of remote) {
            const localEntity = merged.get(remoteEntity.id);
            if (!localEntity) {
                merged.set(remoteEntity.id, remoteEntity);
            }
            else {
                const remoteDate = new Date(remoteEntity.updatedAt);
                const localDate = new Date(localEntity.updatedAt);
                if (remoteDate > localDate) {
                    merged.set(remoteEntity.id, remoteEntity);
                }
            }
        }
        return Array.from(merged.values());
    }
    async recordOperation(operation) {
        const syncOperation = {
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
    async getPendingOperations() {
        return this.pendingOperations;
    }
    async clearPendingOperations() {
        this.pendingOperations = [];
        await this.storage.set('pendingOperations', []);
    }
    async resolveConflict(conflict) {
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
    async applyOperation(operation) {
        const { entityType, type, entityId, data } = operation;
        const storageKey = `${entityType}s`;
        switch (type) {
            case 'create':
            case 'update': {
                const entities = await this.storage.get(storageKey) || [];
                const index = entities.findIndex((e) => e.id === entityId);
                if (index === -1) {
                    entities.push(data);
                }
                else {
                    entities[index] = data;
                }
                await this.storage.set(storageKey, entities);
                break;
            }
            case 'delete': {
                const entities = await this.storage.get(storageKey) || [];
                const filtered = entities.filter((e) => e.id !== entityId);
                await this.storage.set(storageKey, filtered);
                break;
            }
        }
    }
    getConnectedPeers() {
        return Array.from(this.peers.values());
    }
    async updatePeerLastSeen(peerId) {
        const peer = this.peers.get(peerId);
        if (peer) {
            peer.lastSeen = new Date();
        }
    }
}
//# sourceMappingURL=SyncManager.js.map