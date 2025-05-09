import type { Task } from '../tasks/types';
import type { TimeBlock, UserPattern } from '../types';
import type { SyncOperation } from '../sync/SyncManager';
import type { BaseModel } from '../ai/models/types';
import type { ModelType } from '../ai/types';

export interface StorageData {
  tasks: Task[];
  timeBlocks: TimeBlock[];
  userPattern: UserPattern | null;
  pendingOperations: SyncOperation[];
  ai_models: Record<ModelType, BaseModel>;
  patternHistory: Record<string, UserPattern>;
}

export interface StorageAdapter {
  /**
   * Store data with the given key
   * @param key Unique identifier for the data
   * @param data Data to store
   */
  set<K extends keyof StorageData>(key: K, data: StorageData[K]): Promise<void>;

  /**
   * Retrieve data for the given key
   * @param key Unique identifier for the data
   * @returns The stored data, or undefined if not found
   */
  get<K extends keyof StorageData>(key: K): Promise<StorageData[K]>;

  /**
   * Delete data for the given key
   * @param key Unique identifier for the data
   */
  delete(key: string): Promise<void>;

  /**
   * Clear all stored data
   */
  clear(): Promise<void>;

  /**
   * List all keys in storage
   * @returns Array of stored keys
   */
  keys(): Promise<string[]>;

  /**
   * Check if a key exists in storage
   * @param key Key to check
   * @returns true if key exists, false otherwise
   */
  has(key: string): Promise<boolean>;
}

export interface EncryptedStorageOptions {
  /**
   * Encryption key used for data protection
   */
  encryptionKey: string;

  /**
   * Optional initialization vector for encryption
   */
  iv?: string;
}

export interface StorageOptions {
  /**
   * Name/identifier for the storage instance
   */
  namespace: string;

  /**
   * Optional encryption configuration
   */
  encryption?: EncryptedStorageOptions;
} 