export interface PersistedAuthState {
  token: string;
  role: string | null;
  name: string | null;
  id: string | null;
  expiresAt: number | null;
  email?: string | null;
  /** profileId returned from /Auth/GetCurrentUser — needed for doctor/patient API calls */
  profileId?: number | null;
}

export type ThemePreference = 'dark' | 'light';
export type DirectionPreference = 'ltr' | 'rtl';

export interface PersistedPasswordResetFlowState {
  email: string;
  resetToken: string;
  updatedAt: number;
}
