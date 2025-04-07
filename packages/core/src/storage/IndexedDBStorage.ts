import { openDB } from 'idb';
import type { IDBPDatabase } from 'idb';
import type { StorageAdapter, StorageOptions } from './types';
import { StorageEncryption } from './encryption';

export class IndexedDBStorage implements StorageAdapter {
  private dbName: string;
  private storeName: string;
  private db: IDBPDatabase | null = null;
  private encryption: StorageEncryption | null = null;

  constructor(options: StorageOptions) {
    this.dbName = 'eremois';
    this.storeName = options.namespace;

    if (options.encryption) {
      this.encryption = new StorageEncryption(options.encryption);
    }
  }

  private async getDB(): Promise<IDBPDatabase> {
    if (!this.db) {
      this.db = await openDB(this.dbName, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('tasks')) {
            db.createObjectStore('tasks');
          }
        },
      });
    }
    return this.db;
  }

  async set<T>(key: string, data: T): Promise<void> {
    const db = await this.getDB();
    const value = this.encryption ? this.encryption.encrypt(data) : data;
    await db.put(this.storeName, value, key);
  }

  async get<T>(key: string): Promise<T | undefined> {
    const db = await this.getDB();
    const value = await db.get(this.storeName, key);
    
    if (!value) {
      return undefined;
    }

    return this.encryption ? this.encryption.decrypt<T>(value) : (value as T);
  }

  async delete(key: string): Promise<void> {
    const db = await this.getDB();
    await db.delete(this.storeName, key);
  }

  async clear(): Promise<void> {
    const db = await this.getDB();
    await db.clear(this.storeName);
  }

  async keys(): Promise<string[]> {
    const db = await this.getDB();
    return db.getAllKeys(this.storeName) as Promise<string[]>;
  }

  async has(key: string): Promise<boolean> {
    const db = await this.getDB();
    const value = await db.get(this.storeName, key);
    return value !== undefined;
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
} 