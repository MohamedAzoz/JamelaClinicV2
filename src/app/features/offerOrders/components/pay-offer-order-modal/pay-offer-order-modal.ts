import { Component, effect, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, max, min, required } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMoneyBillWave,
  faXmark,
  faCheck,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { DecimalPipe } from '@angular/common';
import { OfferOrdersFacade } from '../../services/offer-orders.facade';

interface PayFormModel {
  amountToPay: number;
}

@Component({
  selector: 'app-pay-offer-order-modal',
  imports: [FormField, FormRoot, FontAwesomeModule, DecimalPipe],
  templateUrl: './pay-offer-order-modal.html',
})
export class PayOfferOrderModalComponent {
  readonly facade = inject(OfferOrdersFacade);

  readonly faMoneyBillWave = faMoneyBillWave;
  readonly faXmark = faXmark;
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;

  private readonly _model = signal<PayFormModel>({ amountToPay: 0 });

  readonly payForm = form(this._model, (path) => {
    required(path.amountToPay, { message: 'المبلغ مطلوب' });
    min(path.amountToPay, 1, { message: 'يجب أن يكون المبلغ أكبر من صفر' });
  });

  constructor() {
    effect(() => {
      if (!this.facade.isPayModalOpen()) {
        this._model.set({ amountToPay: 0 });
      }
    });
  }

  onSubmit(event?: Event): void {
    if (event) event.preventDefault();
    if (this.payForm().invalid()) {
      this.payForm().markAsTouched();
      return;
    }
    const order = this.facade.orderToPay();
    if (!order) return;

    this.facade.payRemainingOfferOrder(order.id, {
      amountToPay: this._model().amountToPay,
    });
  }

  close(): void {
    this.facade.closePayModal();
  }
}
