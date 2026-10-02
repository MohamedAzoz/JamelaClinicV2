import { computed, inject, Service, signal } from '@angular/core';
import { AppDatabase } from '@core/AppDbContext/app-database';
import { PersistedAuthState } from '@core/AppDbContext/storage.models';
import { JWT } from './jwt';
import { IResJWT } from '@shared/models/UserInfo';
import { Theme } from './theme';
import { ROLES } from '@shared/constants/roles.constants';

@Service()
export class IdentityService {
  private readonly appDb = inject(AppDatabase);
  private readonly jwt = inject(JWT);
  private readonly theme = inject(Theme);

  private initPromise: Promise<void> | null = null;

  // State signals
  private readonly _token = signal<string | null>(null);
  private readonly _role = signal<string | null>(null);
  private readonly _name = signal<string | null>(null);
  private readonly _exp = signal<number | null>(null);
  private readonly _email = signal<string | null>(null);
  private readonly _userId = signal<string | null>(null);
  private readonly _hasConfirmedEmail = signal<boolean>(true); // default true for safety
  /**
   * profileId مُشتق من /Auth/GetCurrentUser — يُحفظ في DB بعد أول تسجيل دخول ناجح.
   * يستخدم في استدعاءات API التي تحتاج doctorId / patientId.
   */
  private readonly _profileId = signal<number | null>(null);

  async init(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = this.hydrate();
    }

    await this.initPromise;
  }

  // Read-only public reactive views
  readonly token = this._token.asReadonly();
  readonly userId = computed(() => this._userId() ?? '');
  readonly userRole = this._role.asReadonly();
  readonly userName = this._name.asReadonly();
  readonly tokenExpiration = this._exp.asReadonly();
  readonly userEmail = this._email.asReadonly();
  readonly hasConfirmedEmail = this._hasConfirmedEmail.asReadonly();
  /** profileId من /Auth/GetCurrentUser — صفر إذا لم يُجلب بعد */
  readonly profileId = computed(() => this._profileId() ?? 0);

  readonly isAuthenticated = computed(() => {
    const token = this._token();
    const expiration = this.tokenExpiration();

    if (!token || !expiration) return false;
    const currentTime = Math.floor(Date.now() / 1000);
    return expiration > currentTime;
  });

  readonly isAdmin = computed(() => this._role() === ROLES.Admin);
  readonly isAccountant = computed(() => this._role() === ROLES.Accountant);
  readonly isDoctor = computed(() => this._role() === ROLES.Doctor);
  readonly isReception = computed(() => this._role() === ROLES.Reception);

  // readonly dashboardPath = computed(() => {
  //   const role = this.userRole();
  //   if (role === ROLES.Admin) return '';
  //   if (role === ROLES.Doctor) return '';
  //   if (role === ROLES.Reception) return '';
  //   if (role === ROLES.Assistant) return '';
  //   if (role === ROLES.Patient) return '';
  //   return '/auth/login';
  // });

  private async hydrate(): Promise<void> {
    const storedState = await this.appDb.getAuthState();

    if (storedState && this.hydrateFromState(storedState)) {
      return;
    }

    if (storedState) {
      await this.appDb.clearAuthState();
    }
  }

  private hydrateFromState(state: PersistedAuthState): boolean {
    try {
      const decoded = this.jwt.decodeToken(state.token) as IResJWT;
      const normalizedState = this.normalizeState(state, decoded);
      this.applyAuthState(normalizedState);
      return true;
    } catch {
      return false;
    }
  }

  private normalizeState(state: PersistedAuthState, decoded: IResJWT): PersistedAuthState {
    return {
      token: state.token,
      role: state.role ?? decoded.role ?? null,
      name: state.name ?? decoded.name ?? null,
      id: state.id ?? decoded.nameid ?? null,
      expiresAt: state.expiresAt ?? this.toNumberOrNull(decoded.exp),
      email: state.email ?? null,
      profileId: state.profileId ?? null,
    };
  }

  private applyAuthState(state: PersistedAuthState): void {
    this._token.set(state.token);
    this._role.set(state.role);
    this._name.set(state.name);
    this._exp.set(state.expiresAt);
    this._userId.set(state.id ?? null);
    this._profileId.set(state.profileId ?? null);
  }

  private toNumberOrNull(value: unknown): number | null {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
  }

  /**
   * Updates the authentication state reactively.
   * Called by AuthFacade after successful login/register.
   */
  async setAuth(token: string, profileId?: number | null): Promise<void> {
    const decoded = this.jwt.decodeToken(token) as IResJWT;
    const authState: PersistedAuthState = {
      token,
      role: decoded.role,
      name: decoded.name,
      id: decoded.nameid,
      expiresAt: this.toNumberOrNull(decoded.exp),
      profileId: profileId ?? null,
    };

    this.applyAuthState(authState);
    await this.appDb.saveAuthState(authState);
  }

  /**
   * Updates only the profileId in the persisted state without re-writing the full token.
   * Called after fetching /Auth/GetCurrentUser post-login.
   */
  async setProfileId(profileId: number): Promise<void> {
    this._profileId.set(profileId);

    // Merge profileId into existing persisted state
    const existing = await this.appDb.getAuthState();
    if (existing) {
      await this.appDb.saveAuthState({ ...existing, profileId });
    }
  }

  /**
   * Clears the authentication state.
   */
  clearAuth(): void {
    void this.appDb.clearAuthState();
    void this.theme.resetToDefaultTheme();

    this._token.set(null);
    this._role.set(null);
    this._name.set(null);
    this._exp.set(null);
    this._userId.set(null);
    this._profileId.set(null);
  }
}
