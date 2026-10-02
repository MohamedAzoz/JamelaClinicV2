import { inject, Service } from '@angular/core';
import { DirectionPreference, PersistedAuthState, ThemePreference } from './storage.models';
import { JWT } from '@core/services/jwt';
import { AppDatabase } from './app-database';
import { IResJWT } from '@shared/models/UserInfo';

@Service()
export class StorageMigrationService {
  async init() {
    await this.migrateLegacyLocalStorageOnce();
  }
  private readonly appDb = inject(AppDatabase);
  private readonly jwt = inject(JWT);

  async migrateLegacyLocalStorageOnce(): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    if (await this.appDb.isLegacyMigrationDone()) {
      return;
    }

    await this.migrateAuthState();
    await this.migrateThemePreference();
    await this.migrateDirectionPreference();
    this.removeLegacyKeys();
    await this.appDb.markLegacyMigrationDone();
  }

  private async migrateAuthState(): Promise<void> {
    const existingAuthState = await this.appDb.getAuthState();
    if (existingAuthState) {
      return;
    }

    const encodedToken = window.localStorage.getItem('ef_at');
    if (!encodedToken) {
      return;
    }

    const token = this.decodeLegacyValue(encodedToken) ?? encodedToken;

    try {
      const decoded = this.jwt.decodeToken(token) as IResJWT;
      const authState: PersistedAuthState = {
        token,
        role: decoded.role ?? null,
        name: this.decodeLegacyValue(window.localStorage.getItem('name')) ?? decoded.name ?? null,
        id: this.decodeLegacyValue(window.localStorage.getItem('id')) ?? decoded.nameid ?? null,
        expiresAt: this.toNumberOrNull(decoded.exp),
      };

      await this.appDb.saveAuthState(authState);
    } catch {
      // Keep migration resilient: ignore invalid legacy token payload.
    }
  }

  private async migrateThemePreference(): Promise<void> {
    const existingTheme = await this.appDb.getThemePreference();
    if (existingTheme) {
      return;
    }

    const rawTheme = window.localStorage.getItem('theme');
    if (!rawTheme) {
      return;
    }

    if (rawTheme === 'dark' || rawTheme === 'light') {
      await this.appDb.saveThemePreference(rawTheme as ThemePreference);
    }
  }

  private async migrateDirectionPreference(): Promise<void> {
    const existingDirection = await this.appDb.getDirectionPreference();
    if (existingDirection) {
      return;
    }

    const rawDirection = window.localStorage.getItem('direction');
    if (!rawDirection) {
      return;
    }

    if (rawDirection === 'rtl' || rawDirection === 'ltr') {
      await this.appDb.saveDirectionPreference(rawDirection as DirectionPreference);
    }
  }

  private removeLegacyKeys(): void {
    const keys = Object.keys(window.localStorage);
    keys.forEach((key) => {
      if (key.startsWith('ef_') || key === 'theme' || key === 'direction') {
        window.localStorage.removeItem(key);
      }
    });
  }

  private decodeLegacyValue(value: string | null): string | null {
    if (!value) {
      return null;
    }

    try {
      return atob(value);
    } catch {
      return value;
    }
  }

  private toNumberOrNull(value: unknown): number | null {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
  }
}
