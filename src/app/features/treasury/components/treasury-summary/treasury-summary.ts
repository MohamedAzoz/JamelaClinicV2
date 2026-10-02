import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowTrendUp,
  faCoins,
  faScaleBalanced,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { TreasuryFacade } from '../../services/treasury.facade';

@Component({
  selector: 'app-treasury-summary',
  imports: [FontAwesomeModule],
  templateUrl: './treasury-summary.html',
})
export class TreasurySummaryComponent {
  readonly facade = inject(TreasuryFacade);
  readonly faArrowTrendUp = faArrowTrendUp;
  readonly faCoins = faCoins;
  readonly faScaleBalanced = faScaleBalanced;
  readonly faWallet = faWallet;
  formatMoney(value: number | undefined): string {
    return `${(value ?? 0).toLocaleString('ar-EG')} ج.م`;
  }
}
