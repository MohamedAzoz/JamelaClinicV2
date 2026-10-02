import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export type ConfirmVariant = 'danger' | 'warning' | 'success' | 'primary' | 'info';

export interface ConfirmDetailItem {
  label: string;
  value: string;
}

export interface ConfirmModalOptions {
  title?: string;
  message?: string;
  itemName?: string;
  warningMessage?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
  icon?: IconDefinition;
  details?: ConfirmDetailItem[];
}
