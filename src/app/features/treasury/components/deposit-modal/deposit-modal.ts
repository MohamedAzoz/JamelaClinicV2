import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, min, required } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faCheck,
  faCoins,
  faSpinner,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Deposit } from '../../models/Deposit';
import { TreasuryFacade } from '../../services/treasury.facade';

interface DepositFormModel {
  amount: number;
  description: string;
}

@Component({
  selector: 'app-deposit-modal',
  imports: [FormField, FormRoot, FontAwesomeModule],
  templateUrl: './deposit-modal.html',
})
export class DepositModalComponent {
  readonly facade = inject(TreasuryFacade);

  readonly faCheck = faCheck;
  readonly faCoins = faCoins;
  readonly faArrowDown = faArrowDown;
  readonly faSpinner = faSpinner;
  readonly faXmark = faXmark;

  private readonly model = signal<DepositFormModel>({ amount: 0, description: '' });

  readonly depositForm = form(this.model, (path) => {
    required(path.amount, { message: 'مبلغ الإيداع مطلوب' });
    min(path.amount, 0.01, { message: 'يجب أن يكون مبلغ الإيداع أكبر من صفر' });
    required(path.description, { message: 'بيان وسبب الإيداع مطلوب' });
  });

  submit(event: Event): void {
    event.preventDefault();
    if (this.depositForm().invalid()) {
      this.depositForm().markAsTouched();
      return;
    }
    const value: Deposit = this.model();
    this.facade.deposit(value);
    this.resetForm();
  }

  close(): void {
    this.facade.closeDepositModal();
    this.resetForm();
  }

  private resetForm(): void {
    this.model.set({ amount: 0, description: '' });
  }
}
