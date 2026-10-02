import { Component, effect, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, min, minLength, required } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faFileInvoiceDollar,
  faXmark,
  faCheck,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { OfferOrdersFacade } from '../../services/offer-orders.facade';

interface AddOrderFormModel {
  title: string;
  totalAmount: number;
  paidAmount: number;
}

@Component({
  selector: 'app-add-offer-order-modal',
  imports: [FormField, FormRoot, FontAwesomeModule],
  templateUrl: './add-offer-order-modal.html',
})
export class AddOfferOrderModalComponent {
  readonly facade = inject(OfferOrdersFacade);

  readonly faFileInvoiceDollar = faFileInvoiceDollar;
  readonly faXmark = faXmark;
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;

  private readonly _model = signal<AddOrderFormModel>({
    title: '',
    totalAmount: 0,
    paidAmount: 0,
  });

  readonly orderForm = form(this._model, (path) => {
    required(path.title, { message: 'عنوان الطلب مطلوب' });
    minLength(path.title, 2, { message: 'يجب أن يتكون العنوان من حرفين على الأقل' });
    required(path.totalAmount, { message: 'إجمالي المبلغ مطلوب' });
    min(path.totalAmount, 1, { message: 'يجب أن يكون المبلغ الإجمالي أكبر من صفر' });
    min(path.paidAmount, 0, { message: 'لا يمكن أن تكون الدفعة بالسالب' });
  });

  constructor() {
    effect(() => {
      if (!this.facade.isAddOrderModalOpen()) {
        this._model.set({ title: '', totalAmount: 0, paidAmount: 0 });
      }
    });
  }

  onSubmit(event?: Event): void {
    if (event) event.preventDefault();

    if (this.orderForm().invalid()) {
      this.orderForm().markAsTouched();
      return;
    }

    const companyId = this.facade.companyId();
    if (!companyId) return;

    this.facade.addOfferOrder({
      title: this._model().title.trim(),
      companyId,
      totalAmount: this._model().totalAmount,
      paidAmount: this._model().paidAmount,
    });
  }

  close(): void {
    this.facade.closeAddOrderModal();
  }
}
