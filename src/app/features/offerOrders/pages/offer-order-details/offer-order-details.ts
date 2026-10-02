import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExclamationCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { OfferOrdersFacade } from '../../services/offer-orders.facade';
import { OfferOrderDetailsHeaderComponent } from '../../components/offer-order-details-header/offer-order-details-header';
import { OfferOrderDetailsCardComponent } from '../../components/offer-order-details-card/offer-order-details-card';
import { PayOfferOrderModalComponent } from '../../components/pay-offer-order-modal/pay-offer-order-modal';

@Component({
  selector: 'app-offer-order-details',
  providers: [OfferOrdersFacade],
  imports: [
    FontAwesomeModule,
    OfferOrderDetailsHeaderComponent,
    OfferOrderDetailsCardComponent,
    PayOfferOrderModalComponent,
  ],
  templateUrl: './offer-order-details.html',
})
export class OfferOrderDetailsPage implements OnInit {
  readonly facade = inject(OfferOrdersFacade);

  readonly faSpinner = faSpinner;
  readonly faExclamationCircle = faExclamationCircle;

  private readonly _route = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);

  currentOrderId: number = 0;

  ngOnInit(): void {
    this._route.paramMap.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.currentOrderId = id;
        this.facade.loadOrderDetails(id);
      }
    });
  }
}
