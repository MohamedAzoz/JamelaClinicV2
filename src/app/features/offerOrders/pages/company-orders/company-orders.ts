import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OfferOrdersFacade } from '../../services/offer-orders.facade';
import { OfferOrdersHeaderComponent } from '../../components/offer-orders-header/offer-orders-header';
import { OfferOrdersSummaryComponent } from '../../components/offer-orders-summary/offer-orders-summary';
import { OfferOrdersTableComponent } from '../../components/offer-orders-table/offer-orders-table';
import { AddOfferOrderModalComponent } from '../../components/add-offer-order-modal/add-offer-order-modal';
import { PayOfferOrderModalComponent } from '../../components/pay-offer-order-modal/pay-offer-order-modal';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-company-orders',
  imports: [
    OfferOrdersHeaderComponent,
    OfferOrdersSummaryComponent,
    OfferOrdersTableComponent,
    AddOfferOrderModalComponent,
    PayOfferOrderModalComponent,
    ConfirmModalComponent,
  ],
  providers: [OfferOrdersFacade],
  templateUrl: './company-orders.html',
})
export class CompanyOrdersPage implements OnInit {
  readonly facade = inject(OfferOrdersFacade);
  private readonly _route = inject(ActivatedRoute);

  ngOnInit(): void {
    const idParam = this._route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = parseInt(idParam, 10);
      if (!isNaN(id)) {
        this.facade.initialize(id);
      }
    }
  }
}
