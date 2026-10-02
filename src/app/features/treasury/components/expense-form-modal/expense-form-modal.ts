import { Component, effect, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, min, required } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheck,
  faFileInvoiceDollar,
  faSpinner,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { CreateExpense } from '../../models/CreateExpense';
import { TreasuryFacade } from '../../services/treasury.facade';

interface ExpenseFormModel {
  amount: number;
  description: string;
}
@Component({
  selector: 'app-expense-form-modal',
  imports: [FormField, FormRoot, FontAwesomeModule],
  templateUrl: './expense-form-modal.html',
})
export class ExpenseFormModalComponent {
  readonly facade = inject(TreasuryFacade);
  readonly faCheck = faCheck;
  readonly faFileInvoiceDollar = faFileInvoiceDollar;
  readonly faSpinner = faSpinner;
  readonly faXmark = faXmark;
  private readonly model = signal<ExpenseFormModel>({ amount: 0, description: '' });
  readonly expenseForm = form(this.model, (path) => {
    required(path.amount, { message: 'المبلغ مطلوب' });
    min(path.amount, 0.01, { message: 'يجب أن يكون المبلغ أكبر من صفر' });
    required(path.description, { message: 'وصف المصروف مطلوب' });
  });
  constructor() {
    effect(() => {
      const expense = this.facade.selectedExpense();
      this.model.set(
        expense
          ? { amount: expense.amount, description: expense.description }
          : { amount: 0, description: '' },
      );
    });
  }
  submit(event: Event): void {
    event.preventDefault();
    if (this.expenseForm().invalid()) {
      this.expenseForm().markAsTouched();
      return;
    }
    const value: CreateExpense = this.model();
    const selected = this.facade.selectedExpense();
    selected ? this.facade.updateExpense(selected.id, value) : this.facade.createExpense(value);
  }
}
