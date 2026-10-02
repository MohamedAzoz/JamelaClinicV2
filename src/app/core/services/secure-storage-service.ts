import { injectAsync, onIdle, Service } from '@angular/core';
import { catchError, firstValueFrom, of } from 'rxjs';

@Service()
export class SecureStorageService {
  private cache = new Map<string, any>();
  private dbService = injectAsync(
    () => import('@ng-catbee/indexed-db').then((m) => m.CatbeeIndexedDBService),
    { prefetch: onIdle },
  );

  private readonly encryption = injectAsync(
    () => import('./encryption-service').then((m) => m.EncryptionService),
    { prefetch: onIdle },
  );

  private readonly PREFIX = 'legal:';

  async init() {
    try {
      const items: any = await firstValueFrom(
        (await this.dbService()).getAll('authStore').pipe(catchError(() => of([]))),
      );
      if ((!items || items.length === 0) && window.localStorage.length > 0) {
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k) {
            const rawVal = window.localStorage.getItem(k);
            let parsedVal: any = rawVal;
            try {
              if (rawVal) {
                parsedVal = JSON.parse(rawVal);
              }
            } catch (e) {}
            this.set(k, parsedVal); // This will save to map and encrypt to DB
          }
        }
        return;
      }

      if (items && Array.isArray(items)) {
        for (const item of items) {
          if (item.id && item.id.startsWith(this.PREFIX) && item.payload) {
            try {
              const encryption = await this.encryption();
              const decryptedVal = await encryption.decrypt(item.payload);
              const originalKey = item.id.replace(this.PREFIX, '');
              this.cache.set(originalKey, decryptedVal);
            } catch (e) {
              console.error(`Failed to decrypt item ${item.id}`, e);
              (await this.dbService()).deleteByKey('authStore', item.id).subscribe();
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to load data from IndexedDB', e);
    }
  }

  async set(key: string, value: any) {
    this.cache.set(key, value);
    try {
      const encrypt = await this.encryption();
      const payload = await encrypt.encrypt(value);
      const id = `${this.PREFIX}${key}`;

      (await this.dbService())
        .update('authStore', { id, payload, updatedAt: Date.now() })
        .subscribe({
          error: (e) => console.error('IndexedDB update error', e),
        });
    } catch (error) {
      console.error('Encryption error', error);
    }
  }

  get(key: string) {
    return this.cache.has(key) ? this.cache.get(key) : null;
  }

  async remove(key: string) {
    this.cache.delete(key);
    const id = `${this.PREFIX}${key}`;
    (await this.dbService()).deleteByKey('authStore', id).subscribe({
      error: (e) => console.error('IndexedDB delete error', e),
    });
  }

  clear() {
    for (const key of this.cache.keys()) {
      this.remove(key);
    }
    this.cache.clear();
  }

  has(key: string) {
    return this.cache.has(key);
  }
}
