import { Component, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faInbox,
  faUser,
  faCalendarDays,
  faTrash,
  faMoneyBillWave,
  faFileInvoiceDollar,
} from '@fortawesome/free-solid-svg-icons';
import { OfferOrdersFacade } from '../../services/offer-orders.facade';

@Component({
  selector: 'app-offer-orders-table',
  imports: [FontAwesomeModule, DatePipe, DecimalPipe],
  templateUrl: './offer-orders-table.html',
})
export class OfferOrdersTableComponent {
  readonly facade = inject(OfferOrdersFacade);

  readonly faInbox = faInbox;
  readonly faUser = faUser;
  readonly faCalendarDays = faCalendarDays;
  readonly faTrash = faTrash;
  readonly faMoneyBillWave = faMoneyBillWave;
  readonly faFileInvoiceDollar = faFileInvoiceDollar;
}
