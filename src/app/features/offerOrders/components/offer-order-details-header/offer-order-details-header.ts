import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faRotateRight, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import { OfferOrdersFacade } from '../../services/offer-orders.facade';

@Component({
  selector: 'app-offer-order-details-header',
  imports: [FontAwesomeModule],
  templateUrl: './offer-order-details-header.html',
})
export class OfferOrderDetailsHeaderComponent {
  readonly facade = inject(OfferOrdersFacade);
  private readonly _location = inject(Location);

  readonly orderId = input<number>();

  readonly faArrowRight = faArrowRight;
  readonly faRotateRight = faRotateRight;
  readonly faFileInvoiceDollar = faFileInvoiceDollar;

  goBack(): void {
    this._location.back();
  }

  refresh(): void {
    const id = this.orderId();
    if (id) {
      this.facade.loadOrderDetails(id);
    }
  }
}
