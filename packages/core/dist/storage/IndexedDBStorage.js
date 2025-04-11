import { openDB } from 'idb';
import { StorageEncryption } from './encryption';
export class IndexedDBStorage {
    constructor(options) {
        this.db = null;
        this.encryption = null;
        this.dbName = 'eremois';
        this.storeName = options.namespace;
        if (options.encryption) {
            this.encryption = new StorageEncryption(options.encryption);
        }
    }
    async getDB() {
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
    async set(key, data) {
        const db = await this.getDB();
        const value = this.encryption ? this.encryption.encrypt(data) : data;
        await db.put(this.storeName, value, key);
    }
    async get(key) {
        const db = await this.getDB();
        const value = await db.get(this.storeName, key);
        if (!value) {
            return undefined;
        }
        return this.encryption ? this.encryption.decrypt(value) : value;
    }
    async delete(key) {
        const db = await this.getDB();
        await db.delete(this.storeName, key);
    }
    async clear() {
        const db = await this.getDB();
        await db.clear(this.storeName);
    }
    async keys() {
        const db = await this.getDB();
        return db.getAllKeys(this.storeName);
    }
    async has(key) {
        const db = await this.getDB();
        const value = await db.get(this.storeName, key);
        return value !== undefined;
    }
    /**
     * Close the database connection
     */
    async close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}
//# sourceMappingURL=IndexedDBStorage.js.map