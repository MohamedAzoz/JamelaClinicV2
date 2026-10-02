import { Component, computed, inject, input, model, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTriangleExclamation,
  faTrashCan,
  faBan,
  faCircleCheck,
  faCreditCard,
  faCircleInfo,
  faXmark,
  faSpinner,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { ConfirmDialogService } from './confirm-dialog.service';
import { ConfirmDetailItem, ConfirmVariant } from './confirm-modal.types';

@Component({
  selector: 'app-confirm-modal',
  imports: [FontAwesomeModule],
  templateUrl: './confirm-modal.html',
  host: {
    '(window:keydown.escape)': 'onEscapeKey()',
  },
})
export class ConfirmModalComponent {
  public confirmService = inject(ConfirmDialogService, { optional: true });

  // Component Inputs & Models (Declarative Usage)
  isOpen = model<boolean>(false);
  variant = input<ConfirmVariant>('danger');
  title = input<string>('تأكيد الإجراء');
  message = input<string>('هل أنت تأكد من رغبتك في الاستمرار؟');
  itemName = input<string | null | undefined>(null);
  warningMessage = input<string | null | undefined>(null);
  confirmText = input<string>('تأكيد');
  cancelText = input<string>('إلغاء');
  isLoading = input<boolean>(false);
  icon = input<IconDefinition | null>(null);
  details = input<ConfirmDetailItem[] | null>(null);

  // Component Outputs
  confirmed = output<void>();
  cancelled = output<void>();

  // FontAwesome Icons
  readonly faXmark = faXmark;
  readonly faSpinner = faSpinner;
  readonly faTriangleExclamation = faTriangleExclamation;

  readonly modalTitleId = `confirm-modal-title-${Math.random().toString(36).substring(2, 9)}`;

  // Service Active State
  readonly serviceState = computed(() => this.confirmService?.state() || null);

  // Computed Visibility (Service state OR template model)
  readonly isVisible = computed(() => {
    return this.isOpen() || !!this.serviceState();
  });

  // Active Variant
  readonly activeVariant = computed<ConfirmVariant>(() => {
    return this.serviceState()?.variant || this.variant();
  });

  // Active Title
  readonly activeTitle = computed(() => {
    return this.serviceState()?.title || this.title();
  });

  // Active Message
  readonly activeMessage = computed(() => {
    return this.serviceState()?.message || this.message();
  });

  // Active Item Name
  readonly activeItemName = computed(() => {
    const sName = this.serviceState()?.itemName;
    return sName !== undefined ? sName : this.itemName();
  });

  // Active Warning Message
  readonly activeWarningMessage = computed(() => {
    const sWarn = this.serviceState()?.warningMessage;
    return sWarn !== undefined ? sWarn : this.warningMessage();
  });

  // Active Confirm Button Text
  readonly activeConfirmText = computed(() => {
    return this.serviceState()?.confirmText || this.confirmText();
  });

  // Active Cancel Button Text
  readonly activeCancelText = computed(() => {
    return this.serviceState()?.cancelText || this.cancelText();
  });

  // Active Is Loading
  readonly activeIsLoading = computed(() => {
    const sLoad = this.serviceState()?.isLoading;
    return sLoad !== undefined ? sLoad : this.isLoading();
  });

  // Active Details List
  readonly activeDetails = computed(() => {
    return this.serviceState()?.details ?? this.details();
  });

  // Active Icon Definition
  readonly activeIcon = computed<IconDefinition>(() => {
    const customIcon = this.serviceState()?.icon || this.icon();
    if (customIcon) return customIcon;

    switch (this.activeVariant()) {
      case 'danger':
        return faTrashCan;
      case 'warning':
        return faBan;
      case 'success':
        return faCreditCard;
      case 'primary':
        return faCircleCheck;
      case 'info':
      default:
        return faCircleInfo;
    }
  });

  // Active Theme Styles based on Variant
  readonly variantStyles = computed(() => {
    switch (this.activeVariant()) {
      case 'danger':
        return {
          iconBox: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-8 ring-rose-500/5',
          itemBadge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20',
          warningBox: 'bg-rose-500/5 border-rose-500/20 text-rose-600 dark:text-rose-400',
          confirmButton:
            'bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white shadow-lg shadow-rose-600/25',
        };
      case 'warning':
        return {
          iconBox: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-8 ring-amber-500/5',
          itemBadge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20',
          warningBox: 'bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400',
          confirmButton:
            'bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white shadow-lg shadow-amber-600/25',
        };
      case 'success':
        return {
          iconBox: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/5',
          itemBadge:
            'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20',
          warningBox: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
          confirmButton:
            'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white shadow-lg shadow-emerald-600/25',
        };
      case 'primary':
        return {
          iconBox: 'bg-primary/10 text-primary ring-8 ring-primary/5',
          itemBadge: 'bg-primary/10 text-primary border border-primary/20',
          warningBox: 'bg-primary/5 border-primary/20 text-primary',
          confirmButton:
            'bg-primary hover:bg-primary-hover active:scale-[0.98] text-white shadow-lg shadow-primary/25',
        };
      case 'info':
      default:
        return {
          iconBox: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-8 ring-sky-500/5',
          itemBadge: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20',
          warningBox: 'bg-sky-500/5 border-sky-500/20 text-sky-600 dark:text-sky-400',
          confirmButton:
            'bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white shadow-lg shadow-sky-600/25',
        };
    }
  });

  onConfirm(): void {
    if (this.activeIsLoading()) return;

    if (this.serviceState()) {
      this.confirmService?.resolveModal(true);
    } else {
      this.confirmed.emit();
    }
  }

  onCancel(): void {
    if (this.activeIsLoading()) return;

    if (this.serviceState()) {
      this.confirmService?.close();
    } else {
      this.isOpen.set(false);
      this.cancelled.emit();
    }
  }

  onEscapeKey(): void {
    if (this.isVisible() && !this.activeIsLoading()) {
      this.onCancel();
    }
  }
}
