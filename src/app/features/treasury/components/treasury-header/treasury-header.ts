import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faFileExcel,
  faMoneyBillTrendUp,
  faPlus,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { TreasuryFacade } from '../../services/treasury.facade';

@Component({
  selector: 'app-treasury-header',
  imports: [FontAwesomeModule],
  templateUrl: './treasury-header.html',
})
export class TreasuryHeaderComponent {
  readonly facade = inject(TreasuryFacade);
  readonly faMoneyBillTrendUp = faMoneyBillTrendUp;
  readonly faPlus = faPlus;
  readonly faRotateRight = faRotateRight;
  readonly faFileExcel = faFileExcel;
}
