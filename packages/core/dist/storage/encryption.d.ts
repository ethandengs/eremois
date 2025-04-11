import type { EncryptedStorageOptions } from './types';
export declare class StorageEncryption {
    private key;
    private iv;
    constructor(options: EncryptedStorageOptions);
    /**
     * Encrypt data
     * @param data Data to encrypt
     * @returns Encrypted data string
     */
    encrypt<T>(data: T): string;
    /**
     * Decrypt data
     * @param encryptedData Encrypted data string
     * @returns Decrypted data
     */
    decrypt<T>(encryptedData: string): T;
    /**
     * Get the current initialization vector
     */
    getIV(): string;
}
//# sourceMappingURL=encryption.d.ts.map