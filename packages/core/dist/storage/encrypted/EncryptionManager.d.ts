export interface EncryptionKey {
    id: string;
    key: CryptoKey;
    createdAt: Date;
}
export interface EncryptedData {
    keyId: string;
    iv: Uint8Array;
    data: Uint8Array;
    timestamp: number;
}
export declare class EncryptionManager {
    private keys;
    private currentKeyId;
    constructor();
    generateNewKey(): Promise<string>;
    encrypt(data: any): Promise<EncryptedData>;
    decrypt(encryptedData: EncryptedData): Promise<any>;
    exportKey(keyId: string): Promise<JsonWebKey>;
    importKey(keyId: string, jwk: JsonWebKey): Promise<void>;
    rotateKey(): Promise<string>;
    getCurrentKeyId(): string | null;
    hasKey(keyId: string): boolean;
}
//# sourceMappingURL=EncryptionManager.d.ts.map