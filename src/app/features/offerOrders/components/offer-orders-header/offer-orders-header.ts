import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowRight,
  faBuilding,
  faRotateRight,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { OfferOrdersFacade } from '../../services/offer-orders.facade';

@Component({
  selector: 'app-offer-orders-header',
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './offer-orders-header.html',
})
export class OfferOrdersHeaderComponent {
  readonly facade = inject(OfferOrdersFacade);

  readonly faArrowRight = faArrowRight;
  readonly faBuilding = faBuilding;
  readonly faRotateRight = faRotateRight;
  readonly faPlus = faPlus;
}
