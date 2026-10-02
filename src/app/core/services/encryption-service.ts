import { inject, injectAsync, onIdle, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface EncryptionKeyEntity {
  id: string;
  key: CryptoKey;
  createdAt: number;
}

@Service()
export class EncryptionService {
  private readonly KEY_ID = 'main-aes-key-256-legal';
  private readonly IV_LENGTH = 12;

  private key: CryptoKey | null = null;
  private readonly encoder = new TextEncoder();
  private readonly decoder = new TextDecoder();

  private readonly dbLoader = injectAsync(
    () => import('@ng-catbee/indexed-db').then((m) => m.CatbeeIndexedDBService),
    { prefetch: onIdle }, // تحميل ذكي في الخلفية
  );

  async getKey(): Promise<CryptoKey> {
    if (this.key) {
      return this.key;
    }

    try {
      const db = await this.dbLoader();
      const stored = await firstValueFrom(
        db.getByID<EncryptionKeyEntity>('encryptionKeys', this.KEY_ID),
      );
      if (stored?.key) {
        this.key = stored.key;
        return this.key;
      }
    } catch {
      // Not found or error
    }

    const generatedKey = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      false,
      ['encrypt', 'decrypt'],
    );

    this.key = generatedKey;
    const db = await this.dbLoader();
    await firstValueFrom(
      db.update('encryptionKeys', {
        id: this.KEY_ID,
        key: generatedKey,
        createdAt: Date.now(),
      }),
    ).catch(async () => {
      // Fallback to add if update fails
      await firstValueFrom(
        db.add('encryptionKeys', {
          id: this.KEY_ID,
          key: generatedKey,
          createdAt: Date.now(),
        }),
      ).catch(() => {});
    });

    return generatedKey;
  }

  async encrypt(data: unknown): Promise<string> {
    const key = await this.getKey();
    const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));

    const encoded = this.encoder.encode(JSON.stringify(data));

    const encryptedBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    return this.bytesToBase64(combined);
  }

  async decrypt<T = unknown>(encryptedBase64: string): Promise<T> {
    const key = await this.getKey();
    const combined = this.base64ToBytes(encryptedBase64);

    if (combined.length <= this.IV_LENGTH) {
      throw new Error('Invalid encrypted payload.');
    }

    const iv = combined.slice(0, this.IV_LENGTH);
    const data = combined.slice(this.IV_LENGTH);

    const decryptedBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);

    return JSON.parse(this.decoder.decode(decryptedBuffer)) as T;
  }

  private bytesToBase64(bytes: Uint8Array): string {
    let binary = '';
    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  }

  private base64ToBytes(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  }

  async resetKey(): Promise<void> {
    const db = await this.dbLoader();
    await firstValueFrom(db.deleteByKey('encryptionKeys', this.KEY_ID)).catch(() => {});
    this.key = null;
    await this.getKey();
  }
}
