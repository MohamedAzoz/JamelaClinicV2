import { Component, inject, OnInit } from '@angular/core';
import { SpecialOffersFacade } from '../../services/special-offers.facade';
import { SpecialOffersHeaderComponent } from '../../components/special-offers-header/special-offers-header';
import { SpecialOffersListComponent } from '../../components/special-offers-list/special-offers-list';
import { SpecialOfferFormModalComponent } from '../../components/special-offer-form-modal/special-offer-form-modal';

@Component({
  selector: 'app-special-offers-management',
  providers: [SpecialOffersFacade],
  imports: [
    SpecialOffersHeaderComponent,
    SpecialOffersListComponent,
    SpecialOfferFormModalComponent,
  ],
  templateUrl: './special-offers-management.html',
})
export class SpecialOffersManagementPage implements OnInit {
  readonly facade = inject(SpecialOffersFacade);

  ngOnInit(): void {
    void this.facade.loadOffers();
  }
}
