import { CatbeeIndexedDBConfig } from '@ng-catbee/indexed-db';

export const dbConfig: CatbeeIndexedDBConfig = {
  name: 'JamelaDB',
  version: 22,
  objectStoresMeta: [
    {
      store: 'authStore',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [{ name: 'updatedAt', keypath: 'updatedAt', options: { unique: false } }],
    },
    {
      store: 'settingsStore',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [{ name: 'updatedAt', keypath: 'updatedAt', options: { unique: false } }],
    },
    {
      store: 'examSessionStore',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [{ name: 'updatedAt', keypath: 'updatedAt', options: { unique: false } }],
    },
    {
      store: 'encryptionKeys',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [{ name: 'createdAt', keypath: 'createdAt', options: { unique: false } }],
    },
  ],
};
