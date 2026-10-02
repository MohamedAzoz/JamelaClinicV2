import { Component, inject } from '@angular/core';
import { ConfirmModalComponent } from '@shared/components/confirm-modal';
import { TreasuryFacade } from '../../services/treasury.facade';

@Component({
  selector: 'app-expense-delete-modal',
  imports: [ConfirmModalComponent],
  templateUrl: './expense-delete-modal.html',
})
export class ExpenseDeleteModalComponent {
  readonly facade = inject(TreasuryFacade);

  confirm(): void {
    const expense = this.facade.expenseToDelete();
    if (expense) {
      this.facade.deleteExpense(expense.id);
    }
  }

  close(): void {
    this.facade.closeDeleteModal();
  }
}
