import type { SyncPeer } from './SyncManager';
import type { EncryptedData } from '../storage/encrypted/EncryptionManager';
export interface P2PMessage {
    type: 'SYNC_REQUEST' | 'SYNC_RESPONSE' | 'PEER_DISCOVERY' | 'PEER_ANNOUNCEMENT';
    senderId: string;
    data?: EncryptedData;
    timestamp: number;
}
export interface NetworkStats {
    connectedPeers: number;
    bytesTransferred: number;
    lastSyncTime: Date | null;
    activeSyncCount: number;
}
export interface P2PConfig {
    discoveryInterval: number;
    syncInterval: number;
    maxPeers: number;
    timeout: number;
}
export declare class P2PNetworkManager {
    private peers;
    private config;
    private stats;
    private messageHandlers;
    private discoveryInterval?;
    private syncInterval?;
    constructor(config?: Partial<P2PConfig>);
    start(): Promise<void>;
    stop(): Promise<void>;
    private startDiscovery;
    private startPeriodicSync;
    connectToPeer(peer: SyncPeer): Promise<boolean>;
    disconnectFromPeer(peerId: string): Promise<void>;
    private disconnectFromAllPeers;
    sendMessage(peerId: string, message: P2PMessage): Promise<void>;
    broadcastMessage(message: P2PMessage): Promise<void>;
    onMessage(type: P2PMessage['type'], handler: (message: P2PMessage) => Promise<void>): void;
    private handleMessage;
    private discoverPeers;
    private syncWithPeers;
    getStats(): NetworkStats;
    getPeers(): SyncPeer[];
    updatePeerLastSeen(peerId: string): Promise<void>;
}
//# sourceMappingURL=P2PNetworkManager.d.ts.map