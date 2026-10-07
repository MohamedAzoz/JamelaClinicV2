import { Component, effect, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, min, minLength, required } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { CreateSpecialOffer } from '../../models/CreateSpecialOffer';
import { SpecialOffersFacade } from '../../services/special-offers.facade';

interface SpecialOfferFormModel extends CreateSpecialOffer {}

@Component({
  selector: 'app-special-offer-form-modal',
  imports: [FormField, FormRoot, FontAwesomeModule],
  templateUrl: './special-offer-form-modal.html',
})
export class SpecialOfferFormModalComponent {
  readonly facade = inject(SpecialOffersFacade);
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;
  readonly faXmark = faXmark;
  private readonly model = signal<SpecialOfferFormModel>({
    title: '',
    description: '',
    offerPrice: 0,
    startDate: new Date(),
    endDate: new Date(),
  });

  readonly offerForm = form(this.model, (path) => {
    required(path.title, { message: 'عنوان الخصم مطلوب' });
    minLength(path.title, 3, { message: 'العنوان يجب أن يتكون من 3 أحرف على الأقل' });
    // required(path.description, { message: 'وصف الخصم مطلوب' });
    min(path.offerPrice, 0.01, { message: 'السعر يجب أن يكون أكبر من صفر' });
    required(path.startDate, { message: 'تاريخ بداية العرض مطلوب' });
    required(path.endDate, { message: 'تاريخ نهاية العرض مطلوب' });
  });

  constructor() {
    effect(() => {
      const offer = this.facade.selectedOffer();
      this.model.set({
        title: offer?.title ?? '',
        description: offer?.description ?? '',
        offerPrice: offer?.offerPrice ?? 0,
        startDate: offer?.startDate ? new Date(offer.startDate) : new Date(),
        endDate: offer?.endDate ? new Date(offer.endDate) : new Date(),
      });
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.offerForm().invalid()) {
      this.offerForm().markAsTouched();
      return;
    }

    const offer = this.model();
    if (offer.startDate > offer.endDate) return;
    void this.facade.saveOffer(offer);
  }
}
