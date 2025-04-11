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

export class P2PNetworkManager {
  private peers: Map<string, SyncPeer> = new Map();
  private config: P2PConfig;
  private stats: NetworkStats = {
    connectedPeers: 0,
    bytesTransferred: 0,
    lastSyncTime: null,
    activeSyncCount: 0,
  };

  private messageHandlers: Map<string, (message: P2PMessage) => Promise<void>> = new Map();
  private discoveryInterval?: NodeJS.Timeout;
  private syncInterval?: NodeJS.Timeout;

  constructor(config: Partial<P2PConfig> = {}) {
    this.config = {
      discoveryInterval: config.discoveryInterval || 30000, // 30 seconds
      syncInterval: config.syncInterval || 300000, // 5 minutes
      maxPeers: config.maxPeers || 10,
      timeout: config.timeout || 5000, // 5 seconds
    };
  }

  async start(): Promise<void> {
    this.startDiscovery();
    this.startPeriodicSync();
  }

  async stop(): Promise<void> {
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
    }
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    await this.disconnectFromAllPeers();
  }

  private startDiscovery(): void {
    this.discoveryInterval = setInterval(() => {
      this.discoverPeers().catch(console.error);
    }, this.config.discoveryInterval);
  }

  private startPeriodicSync(): void {
    this.syncInterval = setInterval(() => {
      this.syncWithPeers().catch(console.error);
    }, this.config.syncInterval);
  }

  async connectToPeer(peer: SyncPeer): Promise<boolean> {
    if (this.peers.size >= this.config.maxPeers) {
      return false;
    }

    try {
      // Here you would implement the actual WebRTC connection logic
      this.peers.set(peer.id, peer);
      this.stats.connectedPeers = this.peers.size;
      return true;
    } catch (error) {
      console.error(`Failed to connect to peer ${peer.id}:`, error);
      return false;
    }
  }

  async disconnectFromPeer(peerId: string): Promise<void> {
    this.peers.delete(peerId);
    this.stats.connectedPeers = this.peers.size;
  }

  private async disconnectFromAllPeers(): Promise<void> {
    for (const peerId of this.peers.keys()) {
      await this.disconnectFromPeer(peerId);
    }
  }

  async sendMessage(peerId: string, message: P2PMessage): Promise<void> {
    const peer = this.peers.get(peerId);
    if (!peer) {
      throw new Error(`Peer ${peerId} not found`);
    }

    // Here you would implement the actual message sending logic
    this.stats.bytesTransferred += JSON.stringify(message).length;
  }

  async broadcastMessage(message: P2PMessage): Promise<void> {
    const sendPromises = Array.from(this.peers.keys()).map(peerId =>
      this.sendMessage(peerId, message)
    );
    await Promise.all(sendPromises);
  }

  onMessage(type: P2PMessage['type'], handler: (message: P2PMessage) => Promise<void>): void {
    this.messageHandlers.set(type, handler);
  }

  private async handleMessage(message: P2PMessage): Promise<void> {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      try {
        await handler(message);
      } catch (error) {
        console.error(`Error handling message of type ${message.type}:`, error);
      }
    }
  }

  private async discoverPeers(): Promise<void> {
    const discoveryMessage: P2PMessage = {
      type: 'PEER_DISCOVERY',
      senderId: 'local', // Replace with actual local peer ID
      timestamp: Date.now(),
    };

    await this.broadcastMessage(discoveryMessage);
  }

  private async syncWithPeers(): Promise<void> {
    if (this.stats.activeSyncCount > 0) {
      return; // Sync already in progress
    }

    this.stats.activeSyncCount++;
    try {
      const syncMessage: P2PMessage = {
        type: 'SYNC_REQUEST',
        senderId: 'local', // Replace with actual local peer ID
        timestamp: Date.now(),
      };

      await this.broadcastMessage(syncMessage);
      this.stats.lastSyncTime = new Date();
    } finally {
      this.stats.activeSyncCount--;
    }
  }

  getStats(): NetworkStats {
    return { ...this.stats };
  }

  getPeers(): SyncPeer[] {
    return Array.from(this.peers.values());
  }

  async updatePeerLastSeen(peerId: string): Promise<void> {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.lastSeen = new Date();
    }
  }
} 