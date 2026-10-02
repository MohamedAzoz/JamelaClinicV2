import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendar,
  faEye,
  faFileInvoiceDollar,
  faPen,
  faReceipt,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { Expense } from '../../models/Expense';
import { TreasuryFacade } from '../../services/treasury.facade';
import { TreasuryType } from '@features/treasury/models/ReportExpense';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense-table',
  imports: [FontAwesomeModule],
  templateUrl: './expense-table.html',
})
export class ExpenseTableComponent {
  readonly facade = inject(TreasuryFacade);
  private readonly _router = inject(Router);
  readonly faFileInvoiceDollar = faFileInvoiceDollar;
  readonly faCalendar = faCalendar;
  readonly faPen = faPen;
  readonly faTrashCan = faTrashCan;
  readonly faReceipt = faReceipt;
  readonly faEye = faEye;

  readonly treasuryType = TreasuryType;

  openTransactionDetails(doctorWalletTransactionId: number): void {
    this._router.navigate(['/main/doctor-wallet/transactions', doctorWalletTransactionId]);
  }

  openAppointmentDetails(appointmentId: number): void {
    this._router.navigate(['/main/appointment-details', appointmentId]);
  }

  openOfferOrderDetails(offerOrderId: number): void {
    this._router.navigate(['/main/offer-orders', offerOrderId]);
  }
  formatType(value: TreasuryType): string {
    switch (value) {
      case TreasuryType.Expense:
        return 'مصروفات';
      case TreasuryType.Income:
        return 'ايرادات';
      default:
        return '';
    }
  }
  formatTypeClass(value: TreasuryType): string {
    switch (value) {
      case TreasuryType.Expense:
        return 'bg-danger/10 text-danger';
      case TreasuryType.Income:
        return 'bg-success/10 text-success';
      default:
        return '';
    }
  }

  formatMoney(value: number): string {
    return `${value} ج.م`;
  }
  formatDate(value: string): string {
    return new Date(value).toLocaleDateString('ar-EG');
  }
  edit(expense: Expense): void {
    this.facade.openEditModal(expense);
  }
  remove(expense: Expense): void {
    this.facade.openDeleteModal(expense);
  }
}
