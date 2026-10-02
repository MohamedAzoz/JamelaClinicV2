import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faReceipt, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DoctorWalletFacade } from '../../services/doctor-wallet.facade';
import { WalletTransactionType } from '@features/doctorWallet/models/WalletTransactionType';
import { Router } from '@angular/router';
import { DoctorWalletReport } from '@features/doctorWallet/models/DoctorWalletReport';

@Component({
  selector: 'app-wallet-table',
  imports: [DatePipe, DecimalPipe, FontAwesomeModule],
  templateUrl: './wallet-table.html',
})
export class WalletTableComponent {
  // [x: string]: any;
  readonly facade = inject(DoctorWalletFacade);
  private readonly _router = inject(Router);
  readonly faReceipt = faReceipt;
  readonly faSpinner = faSpinner;
  readonly faEye = faEye;
  readonly faTrash = faTrash;

  WalletTransactionType = WalletTransactionType;
  openTransactionDetails(transaction: DoctorWalletReport): void {
    this._router.navigate(['/main/doctor-wallet/transactions', transaction.id]);
  }

  openAppointmentDetails(transaction: DoctorWalletReport): void {
    if (transaction.appointmentId) {
      this._router.navigate(['/main/appointment-details', transaction.appointmentId]);
    }
  }

  onDelete(id: number): void {
    this.facade.deleteTransaction(id);
  }

  formatType(type: WalletTransactionType): string {
    switch (type) {
      case WalletTransactionType.Deposit:
        return 'إيداع';
      case WalletTransactionType.Withdrawal:
        return 'سحب';
      default:
        return '';
    }
  }
  formatTypeClass(type: WalletTransactionType): string {
    switch (type) {
      case WalletTransactionType.Deposit:
        return 'bg-success/10 text-success';
      case WalletTransactionType.Withdrawal:
        return 'bg-danger/10 text-danger';
      default:
        return '';
    }
  }
}
