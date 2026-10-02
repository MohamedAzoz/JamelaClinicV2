export const ROLES = {
  Admin: 'Admin',
  Doctor: 'Doctor',
  Reception: 'Reception',
  // مخاسب
  Accountant: 'Accountant',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
