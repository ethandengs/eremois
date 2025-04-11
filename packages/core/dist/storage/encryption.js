import CryptoJS from 'crypto-js';
export class StorageEncryption {
    constructor(options) {
        this.key = options.encryptionKey;
        this.iv = options.iv || CryptoJS.lib.WordArray.random(16).toString();
    }
    /**
     * Encrypt data
     * @param data Data to encrypt
     * @returns Encrypted data string
     */
    encrypt(data) {
        const jsonStr = JSON.stringify(data);
        const encrypted = CryptoJS.AES.encrypt(jsonStr, this.key, {
            iv: CryptoJS.enc.Hex.parse(this.iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return encrypted.toString();
    }
    /**
     * Decrypt data
     * @param encryptedData Encrypted data string
     * @returns Decrypted data
     */
    decrypt(encryptedData) {
        const decrypted = CryptoJS.AES.decrypt(encryptedData, this.key, {
            iv: CryptoJS.enc.Hex.parse(this.iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        const jsonStr = decrypted.toString(CryptoJS.enc.Utf8);
        return JSON.parse(jsonStr);
    }
    /**
     * Get the current initialization vector
     */
    getIV() {
        return this.iv;
    }
}
//# sourceMappingURL=encryption.js.map