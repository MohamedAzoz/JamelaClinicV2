import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faCircleExclamation, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { SpecialOffersFacade } from '../../services/special-offers.facade';
import { SpecialOfferDetailsViewComponent } from '../../components/special-offer-details-view/special-offer-details-view';
import { Location } from '@angular/common';
import { SpecialOfferBookingFormComponent } from '@features/specialOffers/components/special-offer-booking-form/special-offer-booking-form';
import { SpecialOfferConvertBookingComponent } from '@features/specialOffers/components/special-offer-convert-booking/special-offer-convert-booking';

@Component({
  selector: 'app-special-offer-details',
  providers: [SpecialOffersFacade],
  imports: [
    FontAwesomeModule,
    SpecialOfferDetailsViewComponent,
    SpecialOfferBookingFormComponent,
    SpecialOfferConvertBookingComponent,
  ],
  templateUrl: './special-offer-details.html',
})
export class SpecialOfferDetailsPage implements OnInit {
  readonly facade = inject(SpecialOffersFacade);
  readonly location = inject(Location);
  readonly faSpinner = faSpinner;
  readonly faArrowRight = faArrowRight;
  readonly faCircleExclamation = faCircleExclamation;
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      void this.facade.loadOfferDetails(Number(params.get('id')));
    });
  }
  goBack(): void {
    this.location.back();
  }
}
