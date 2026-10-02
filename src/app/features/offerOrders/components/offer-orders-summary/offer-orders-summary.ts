import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBoxesPacking,
  faCoins,
  faCreditCard,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import { OfferOrdersFacade } from '../../services/offer-orders.facade';

@Component({
  selector: 'app-offer-orders-summary',
  imports: [FontAwesomeModule, DecimalPipe],
  templateUrl: './offer-orders-summary.html',
})
export class OfferOrdersSummaryComponent {
  readonly facade = inject(OfferOrdersFacade);

  readonly faBoxesPacking = faBoxesPacking;
  readonly faCoins = faCoins;
  readonly faCreditCard = faCreditCard;
  readonly faReceipt = faReceipt;
}
