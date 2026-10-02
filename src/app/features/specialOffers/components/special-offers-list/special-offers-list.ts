import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faPen, faPowerOff, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ConfirmDialogService, ConfirmModalComponent } from '@shared/components/confirm-modal';
import { CreateSpecialOfferResponse } from '../../models/CreateSpecialOfferResponse';
import { SpecialOffersFacade } from '../../services/special-offers.facade';

@Component({
  selector: 'app-special-offers-list',
  imports: [DatePipe, DecimalPipe, FontAwesomeModule, ConfirmModalComponent],
  templateUrl: './special-offers-list.html',
})
export class SpecialOffersListComponent {
  readonly facade = inject(SpecialOffersFacade);
  private readonly router = inject(Router);
  private readonly _confirmService = inject(ConfirmDialogService);

  readonly faEye = faEye;
  readonly faPen = faPen;
  readonly faPowerOff = faPowerOff;
  readonly faSpinner = faSpinner;
  readonly faTrash = faTrash;

  openDetails(offer: CreateSpecialOfferResponse): void {
    void this.router.navigate(['/main/special-offers', offer.id]);
  }

  async toggleStatus(offer: CreateSpecialOfferResponse): Promise<void> {
    const isActivating = !offer.isActive;
    const confirmed = isActivating
      ? await this._confirmService.activate(
          offer.title,
          `هل أنت تأكد من رغبتك في تفعيل العرض/الخصم الخاص "${offer.title}"؟`
        )
      : await this._confirmService.deactivate(
          offer.title,
          `هل أنت تأكد من رغبتك في إيقاف العرض/الخصم الخاص "${offer.title}"؟`
        );

    if (confirmed) {
      this.facade.toggleStatus(offer);
    }
  }
}
