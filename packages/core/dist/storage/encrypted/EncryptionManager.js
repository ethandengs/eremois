import { webcrypto } from 'node:crypto';
export class EncryptionManager {
    constructor() {
        this.keys = new Map();
        this.currentKeyId = null;
        this.generateNewKey().catch(console.error);
    }
    async generateNewKey() {
        const key = await webcrypto.subtle.generateKey({
            name: 'AES-GCM',
            length: 256,
        }, true, ['encrypt', 'decrypt']);
        const keyId = webcrypto.randomUUID();
        this.keys.set(keyId, {
            id: keyId,
            key,
            createdAt: new Date(),
        });
        this.currentKeyId = keyId;
        return keyId;
    }
    async encrypt(data) {
        if (!this.currentKeyId) {
            throw new Error('No encryption key available');
        }
        const key = this.keys.get(this.currentKeyId);
        if (!key) {
            throw new Error('Current encryption key not found');
        }
        // Generate a random IV for each encryption
        const iv = webcrypto.getRandomValues(new Uint8Array(12));
        // Convert data to Uint8Array
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(JSON.stringify(data));
        // Encrypt the data
        const encryptedData = await webcrypto.subtle.encrypt({
            name: 'AES-GCM',
            iv,
        }, key.key, dataBuffer);
        return {
            keyId: key.id,
            iv,
            data: new Uint8Array(encryptedData),
            timestamp: Date.now(),
        };
    }
    async decrypt(encryptedData) {
        const key = this.keys.get(encryptedData.keyId);
        if (!key) {
            throw new Error(`Encryption key ${encryptedData.keyId} not found`);
        }
        try {
            const decryptedBuffer = await webcrypto.subtle.decrypt({
                name: 'AES-GCM',
                iv: encryptedData.iv,
            }, key.key, encryptedData.data);
            const decoder = new TextDecoder();
            const decryptedText = decoder.decode(decryptedBuffer);
            return JSON.parse(decryptedText);
        }
        catch (error) {
            throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async exportKey(keyId) {
        const key = this.keys.get(keyId);
        if (!key) {
            throw new Error(`Key ${keyId} not found`);
        }
        return webcrypto.subtle.exportKey('jwk', key.key);
    }
    async importKey(keyId, jwk) {
        const key = await webcrypto.subtle.importKey('jwk', jwk, {
            name: 'AES-GCM',
            length: 256,
        }, true, ['encrypt', 'decrypt']);
        this.keys.set(keyId, {
            id: keyId,
            key,
            createdAt: new Date(),
        });
    }
    async rotateKey() {
        const newKeyId = await this.generateNewKey();
        // Here you might want to implement key rotation logic
        // such as re-encrypting existing data with the new key
        return newKeyId;
    }
    getCurrentKeyId() {
        return this.currentKeyId;
    }
    hasKey(keyId) {
        return this.keys.has(keyId);
    }
}
//# sourceMappingURL=EncryptionManager.js.map