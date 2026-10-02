import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faCalendarDays,
  faClinicMedical,
  faFileLines,
  faHashtag,
  faUser,
  faUserTie,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorWalletReport } from '../../models/DoctorWalletReport';
import { WalletTransactionType } from '../../models/WalletTransactionType';

@Component({
  selector: 'app-wallet-transaction-details-card',
  imports: [DatePipe, DecimalPipe, RouterLink, FontAwesomeModule],
  templateUrl: './wallet-transaction-details-card.html',
})
export class WalletTransactionDetailsCardComponent {
  readonly transaction = input.required<DoctorWalletReport>();
  readonly isDeposit = computed(() => this.transaction().type === WalletTransactionType.Deposit);
  readonly transactionLabel = computed(() => (this.isDeposit() ? 'إيداع رصيد' : 'سحب رصيد'));
  readonly typeClass = computed(() =>
    this.isDeposit()
      ? 'border-success/20 bg-success/10 text-success'
      : 'border-danger/20 bg-danger/10 text-danger',
  );

  readonly faArrowDown = faArrowDown;
  readonly faArrowUp = faArrowUp;
  readonly faCalendarDays = faCalendarDays;
  readonly faClinicMedical = faClinicMedical;
  readonly faFileLines = faFileLines;
  readonly faHashtag = faHashtag;
  readonly faUser = faUser;
  readonly faUserTie = faUserTie;
  readonly faWallet = faWallet;
}
