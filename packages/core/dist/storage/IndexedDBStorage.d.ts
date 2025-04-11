import type { StorageAdapter, StorageOptions } from './types';
export declare class IndexedDBStorage implements StorageAdapter {
    private dbName;
    private storeName;
    private db;
    private encryption;
    constructor(options: StorageOptions);
    private getDB;
    set<T>(key: string, data: T): Promise<void>;
    get<T>(key: string): Promise<T | undefined>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    keys(): Promise<string[]>;
    has(key: string): Promise<boolean>;
    /**
     * Close the database connection
     */
    close(): Promise<void>;
}
//# sourceMappingURL=IndexedDBStorage.d.ts.map