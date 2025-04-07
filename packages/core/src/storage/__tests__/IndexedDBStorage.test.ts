import { IndexedDBStorage } from '../IndexedDBStorage';
import type { StorageOptions } from '../types';

jest.mock('idb', () => {
  const mockDB = {
    put: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
    getAllKeys: jest.fn(),
    close: jest.fn(),
  };

  return {
    openDB: jest.fn().mockResolvedValue(mockDB),
  };
});

describe('IndexedDBStorage', () => {
  let storage: IndexedDBStorage;
  const options: StorageOptions = {
    namespace: 'test-store',
  };

  beforeEach(() => {
    storage = new IndexedDBStorage(options);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await storage.close();
  });

  describe('basic operations', () => {
    it('should store and retrieve data', async () => {
      const testData = { id: '1', name: 'Test' };
      const db = await (storage as any).getDB();
      db.get.mockResolvedValueOnce(testData);

      await storage.set('test-key', testData);
      const retrieved = await storage.get('test-key');

      expect(db.put).toHaveBeenCalledWith('test-store', testData, 'test-key');
      expect(retrieved).toEqual(testData);
    });

    it('should return undefined for non-existent key', async () => {
      const db = await (storage as any).getDB();
      db.get.mockResolvedValueOnce(undefined);

      const result = await storage.get('non-existent');
      expect(result).toBeUndefined();
    });

    it('should delete data', async () => {
      const db = await (storage as any).getDB();
      await storage.delete('test-key');
      expect(db.delete).toHaveBeenCalledWith('test-store', 'test-key');
    });

    it('should clear all data', async () => {
      const db = await (storage as any).getDB();
      await storage.clear();
      expect(db.clear).toHaveBeenCalledWith('test-store');
    });

    it('should list all keys', async () => {
      const mockKeys = ['key1', 'key2'];
      const db = await (storage as any).getDB();
      db.getAllKeys.mockResolvedValueOnce(mockKeys);

      const keys = await storage.keys();
      expect(keys).toEqual(mockKeys);
    });

    it('should check if key exists', async () => {
      const db = await (storage as any).getDB();
      db.get.mockResolvedValueOnce({ data: 'exists' });
      const exists = await storage.has('test-key');
      expect(exists).toBe(true);

      db.get.mockResolvedValueOnce(undefined);
      const notExists = await storage.has('non-existent');
      expect(notExists).toBe(false);
    });
  });

  describe('encrypted storage', () => {
    const encryptedOptions: StorageOptions = {
      namespace: 'encrypted-store',
      encryption: {
        encryptionKey: 'test-key-123',
        iv: 'test-iv-456',
      },
    };

    beforeEach(() => {
      storage = new IndexedDBStorage(encryptedOptions);
    });

    it('should encrypt data when storing', async () => {
      const testData = { secret: 'sensitive-data' };
      const db = await (storage as any).getDB();
      await storage.set('encrypted-key', testData);

      // Verify that encrypted data was stored
      expect(db.put).toHaveBeenCalled();
      const [storeName, storedValue] = db.put.mock.calls[0];
      expect(storeName).toBe('encrypted-store');
      expect(typeof storedValue).toBe('string'); // Should be encrypted string
      expect(storedValue).not.toBe(JSON.stringify(testData)); // Should not be plain JSON
    });

    it('should decrypt data when retrieving', async () => {
      const testData = { secret: 'sensitive-data' };
      const db = await (storage as any).getDB();
      
      // Store encrypted data
      await storage.set('encrypted-key', testData);
      const [, encryptedValue] = db.put.mock.calls[0];
      
      // Mock retrieval of encrypted data
      db.get.mockResolvedValueOnce(encryptedValue);
      
      const retrieved = await storage.get('encrypted-key');
      expect(retrieved).toEqual(testData);
    });
  });
}); 