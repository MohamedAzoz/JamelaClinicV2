import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faScaleBalanced,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorWalletFacade } from '../../services/doctor-wallet.facade';

@Component({
  selector: 'app-wallet-summary',
  imports: [DecimalPipe, FontAwesomeModule],
  templateUrl: './wallet-summary.html',
})
export class WalletSummaryComponent {
  readonly facade = inject(DoctorWalletFacade);
  readonly cards = computed(() => {
    const summary = this.facade.summary();
    return [
      {
        title: 'إيداعات الفترة',
        value: summary?.periodDeposits,
        icon: faArrowDown,
        hint: 'إجمالي الإضافات خلال الفترة المحددة',
      },
      {
        title: 'سحوبات الفترة',
        value: summary?.periodWithdrawals,
        icon: faArrowUp,
        hint: 'إجمالي السحوبات خلال الفترة المحددة',
      },
      {
        title: 'صافي حركة الفترة',
        value: summary?.periodNetBalance,
        icon: faScaleBalanced,
        hint: 'الفرق بين الإيداعات والسحوبات',
      },
      {
        title: 'الرصيد الإجمالي',
        value: summary?.totalOverallBalance,
        icon: faWallet,
        hint: 'الرصيد الكلي لجميع الفترات',
      },
    ];
  });
}
