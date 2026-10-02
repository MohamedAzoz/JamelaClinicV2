import { inject, Service } from '@angular/core';
import { EncryptionService } from '@core/services/encryption-service';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { firstValueFrom, catchError, of } from 'rxjs';
import {
  DirectionPreference,
  PersistedAuthState,
  PersistedPasswordResetFlowState,
  ThemePreference,
} from './storage.models';

interface EncryptedEntry {
  id: string;
  payload: string;
  updatedAt: number;
}
@Service()
export class AppDatabase {
  private readonly AUTH_STATE_KEY = 'auth:state';
  private readonly PASSWORD_RESET_FLOW_KEY = 'auth:password-reset-flow';
  private readonly THEME_KEY = 'setting:theme';
  private readonly DIRECTION_KEY = 'setting:direction';
  private readonly LEGACY_MIGRATION_KEY = 'setting:migration:local-storage:v1';
  private readonly EXAM_SESSION_PREFIX = 'exam-session:';
  private readonly LEGACY_PREFIX = 'legacy:';

  private readonly encryption = inject(EncryptionService);
  private readonly db = inject(CatbeeIndexedDBService);

  // --- Auth State ---
  async saveAuthState(state: PersistedAuthState): Promise<void> {
    await this.writeEncrypted('authStore', this.AUTH_STATE_KEY, state);
  }

  async getAuthState(): Promise<PersistedAuthState | null> {
    return this.readEncrypted<PersistedAuthState>('authStore', this.AUTH_STATE_KEY);
  }

  async clearAuthState(): Promise<void> {
    await firstValueFrom(this.db.deleteByKey('authStore', this.AUTH_STATE_KEY));
  }
  // PASSWORD_RESET_FLOW_KEY
  async savePasswordResetFlowState(state: PersistedPasswordResetFlowState): Promise<void> {
    await this.writeEncrypted('authStore', this.PASSWORD_RESET_FLOW_KEY, state);
  }

  async getPasswordResetFlowState(): Promise<PersistedPasswordResetFlowState | null> {
    return this.readEncrypted<PersistedPasswordResetFlowState>(
      'authStore',
      this.PASSWORD_RESET_FLOW_KEY,
    );
  }

  async clearPasswordResetFlowState(): Promise<void> {
    await firstValueFrom(this.db.deleteByKey('authStore', this.PASSWORD_RESET_FLOW_KEY)).catch(
      () => {},
    );
  }

  // --- Theme ---
  async saveThemePreference(theme: ThemePreference): Promise<void> {
    await this.writeEncrypted('settingsStore', this.THEME_KEY, theme);
  }

  async getThemePreference(): Promise<ThemePreference | null> {
    return this.readEncrypted<ThemePreference>('settingsStore', this.THEME_KEY);
  }
  async clearThemePreference(): Promise<void> {
    await firstValueFrom(this.db.deleteByKey('settingsStore', this.THEME_KEY)).catch(() => {});
  }

  // Direction
  async saveDirectionPreference(direction: DirectionPreference): Promise<void> {
    await this.writeEncrypted('settingsStore', this.DIRECTION_KEY, direction);
  }

  async getDirectionPreference(): Promise<DirectionPreference | null> {
    return this.readEncrypted<DirectionPreference>('settingsStore', this.DIRECTION_KEY);
  }
  async clearDirectionPreference(): Promise<void> {
    await firstValueFrom(this.db.deleteByKey('settingsStore', this.DIRECTION_KEY)).catch(() => {});
  }

  // --- Migration Helpers ---
  async isLegacyMigrationDone(): Promise<boolean> {
    const done = await this.readEncrypted<boolean>('settingsStore', this.LEGACY_MIGRATION_KEY);
    return done === true;
  }

  async markLegacyMigrationDone(): Promise<void> {
    await this.writeEncrypted('settingsStore', this.LEGACY_MIGRATION_KEY, true);
  }

  // --- Core Operations (The Fix) ---

  /**
   * دالة الكتابة المحسنة:
   * تستخدم 'update' مباشرة لأنها تقوم بـ IDB put (إضافة أو تحديث تلقائي)
   */
  private async writeEncrypted<T>(storeName: string, id: string, value: T): Promise<void> {
    try {
      const payload = await this.encryption.encrypt(value);
      const entry: EncryptedEntry = {
        id,
        payload,
        updatedAt: Date.now(),
      };
      await firstValueFrom(this.db.update(storeName, entry));
    } catch (error: any) {
      if (error.name === 'InvalidStateError' || error.message.includes('closing')) {
        console.warn(`DB Write ignored: Connection is closing during [${storeName}:${id}]`);
        return;
      }
      throw error;
    }
  }
  /**
   * دالة القراءة المحسنة:
   * تتعامل مع الأخطاء داخلياً لضمان عدم توقف التطبيق
   */
  private async readEncrypted<T>(storeName: string, id: string): Promise<T | null> {
    try {
      // استخدام getByID المباشر
      const entry = await firstValueFrom(
        this.db.getByID<EncryptedEntry>(storeName, id).pipe(
          catchError(() => of(null)), // منع الـ Observable من رمي خطأ يكسر الـ Promise
        ),
      );

      if (!entry || !entry.payload) return null;

      return await this.encryption.decrypt<T>(entry.payload);
    } catch (error) {
      console.error(`DB Read Error [${storeName}:${id}]:`, error);
      return null;
    }
  }

  // دالة حذف جماعي محسنة باستخدام RxJS
  async clearAllLegacyValues(): Promise<void> {
    const all = await firstValueFrom(this.db.getAll<EncryptedEntry>('settingsStore'));
    if (!all) return;

    const legacyKeys = all.filter((e) => e.id.startsWith(this.LEGACY_PREFIX)).map((e) => e.id);

    // تنفيذ الحذف بشكل متوازي لسرعة أكبر
    await Promise.all(
      legacyKeys.map((key) => firstValueFrom(this.db.deleteByKey('settingsStore', key))),
    );
  }

  // --- Legacy Value Helpers ---
  /**
   * حفظ قيمة قديمة مع إضافة البادئة legacy:
   */
  async setLegacyValue(key: string, value: string): Promise<void> {
    const storageKey = this.getLegacyStorageKey(key);
    await this.writeEncrypted('settingsStore', storageKey, value);
  }

  /**
   * جلب قيمة قديمة باستخدام البادئة legacy:
   */
  async getLegacyValue(key: string): Promise<string | null> {
    const storageKey = this.getLegacyStorageKey(key);
    return this.readEncrypted<string>('settingsStore', storageKey);
  }

  /**
   * حذف قيمة قديمة معينة
   */
  async deleteLegacyValue(key: string): Promise<void> {
    const storageKey = this.getLegacyStorageKey(key);
    await firstValueFrom(this.db.deleteByKey('settingsStore', storageKey)).catch(() => {});
  }

  /**
   * التحقق من وجود قيمة قديمة
   */
  async hasLegacyValue(key: string): Promise<boolean> {
    const storageKey = this.getLegacyStorageKey(key);
    try {
      const value = await firstValueFrom(this.db.getByID('settingsStore', storageKey));
      return !!value; // إرجاع true إذا وجدت القيمة
    } catch {
      return false;
    }
  }

  /**
   * الدالة التي استفسرت عنها: هي المحرك الأساسي لضمان عدم اختلاط المفاتيح الجديدة بالقديمة
   */
  private getLegacyStorageKey(key: string): string {
    return `${this.LEGACY_PREFIX}${key}`;
  }
}
