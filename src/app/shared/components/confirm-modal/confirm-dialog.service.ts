import { Injectable, signal } from '@angular/core';
import { ConfirmDetailItem, ConfirmModalOptions, ConfirmVariant } from './confirm-modal.types';

export interface ActiveConfirmModal extends ConfirmModalOptions {
  id: number;
  resolve: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private _state = signal<ActiveConfirmModal | null>(null);
  public state = this._state.asReadonly();

  /**
   * Opens a general confirmation modal and returns a Promise resolving to boolean
   */
  confirm(options: ConfirmModalOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this._state.set({
        ...options,
        id: Date.now(),
        resolve,
      });
    });
  }

  /**
   * Helper for Delete / حذف actions
   */
  delete(itemName: string, customMessage?: string, title = 'تأكيد الحذف'): Promise<boolean> {
    return this.confirm({
      variant: 'danger',
      title,
      itemName,
      message: customMessage || `هل أنت تأكد من رغبتك في حذف العنصر المحدد؟`,
      warningMessage: 'تحذير: هذا الإجراء سيؤدي إلى حذف البيانات بشكل دائم ولا يمكن التراجع عنه لاحقاً.',
      confirmText: 'نعم، قم بالحذف',
      cancelText: 'إلغاء',
    });
  }

  /**
   * Helper for Deactivate / إلغاء التفعيل actions
   */
  deactivate(itemName: string, customMessage?: string, title = 'تأكيد إلغاء التفعيل'): Promise<boolean> {
    return this.confirm({
      variant: 'warning',
      title,
      itemName,
      message: customMessage || `هل أنت تأكد من رغبتك في إيقاف وإلغاء تفعيل هذا العنصر؟`,
      confirmText: 'إلغاء التفعيل',
      cancelText: 'تراجع',
    });
  }

  /**
   * Helper for Activate / التفعيل actions
   */
  activate(itemName: string, customMessage?: string, title = 'تأكيد التفعيل'): Promise<boolean> {
    return this.confirm({
      variant: 'success',
      title,
      itemName,
      message: customMessage || `هل أنت تأكد من رغبتك في إعادات تفعيل هذا العنصر؟`,
      confirmText: 'تفعيل الآن',
      cancelText: 'إلغاء',
    });
  }

  /**
   * Helper for Payment / الدفع actions
   */
  pay(
    amountText: string,
    customMessage?: string,
    title = 'تأكيد عملية الدفع',
    details?: ConfirmDetailItem[]
  ): Promise<boolean> {
    return this.confirm({
      variant: 'success',
      title,
      itemName: amountText,
      message: customMessage || `هل أنت تأكد من رغبتك في اعتماد وإتمام عملية الدفع؟`,
      confirmText: 'تأكيد وتسديد الدفع',
      cancelText: 'تراجع',
      details,
    });
  }

  /**
   * Helper for Complete / الإنهاء actions (e.g. appointment completion)
   */
  complete(
    title = 'تأكيد إنهاء الكشف',
    message = 'هل أنت تأكد من إتمام الكشف وإنهاء الحجز بنجاح؟',
    details?: ConfirmDetailItem[]
  ): Promise<boolean> {
    return this.confirm({
      variant: 'primary',
      title,
      message,
      confirmText: 'إنهاء الكشف والحجز',
      cancelText: 'إلغاء',
      details,
    });
  }

  /**
   * Sets loading state for the current active confirmation modal
   */
  setLoading(loading: boolean): void {
    const current = this._state();
    if (current) {
      this._state.set({ ...current, isLoading: loading });
    }
  }

  /**
   * Resolves current modal with result boolean and closes it
   */
  resolveModal(result: boolean): void {
    const current = this._state();
    if (current) {
      current.resolve(result);
      this._state.set(null);
    }
  }

  /**
   * Closes the active modal with false
   */
  close(): void {
    this.resolveModal(false);
  }
}
