import { Component, effect, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, minLength, pattern, required } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { SpecialOffersFacade } from '../../services/special-offers.facade';
import { PaymentMethod } from '@features/appointments/models/PaymentMethod';

interface BookingFormModel {
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  paymentMethod: string;
}

@Component({
  selector: 'app-special-offer-booking-form',
  imports: [FormField, FormRoot, FontAwesomeModule],
  templateUrl: './special-offer-booking-form.html',
})
export class SpecialOfferBookingFormComponent {
  readonly facade = inject(SpecialOffersFacade);
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;
  readonly faXmark = faXmark;
  private readonly model = signal<BookingFormModel>({
    patientName: '',
    patientPhoneNumber: '',
    patientAddress: '',
    paymentMethod: PaymentMethod.Cash.toString(),
  });

  readonly paymentMethods = [
    { value: PaymentMethod.Cash.toString(), label: 'نقداً (كاش)', icon: '💵' },
    { value: PaymentMethod.VodafoneCash.toString(), label: 'فودافون كاش', icon: '📱' },
    { value: PaymentMethod.InstaPay.toString(), label: 'إنستا باي', icon: '⚡' },
  ];

  readonly bookingForm = form(this.model, (path) => {
    required(path.patientName, { message: 'اسم المريض مطلوب' });
    minLength(path.patientName, 3, { message: 'الاسم يجب أن يتكون من 3 أحرف على الأقل' });
    required(path.patientPhoneNumber, { message: 'رقم الهاتف مطلوب' });
    pattern(path.patientPhoneNumber, /^(01[0125][0-9]{8})$/, {
      message: 'أدخل رقم هاتف مصري صحيحًا مكونًا من 11 رقمًا',
    });
    required(path.patientAddress, { message: 'عنوان المريض مطلوب' });
    required(path.paymentMethod, { message: 'يرجى اختيار طريقة الدفع' });
  });

  constructor() {
    effect(() => {
      const booking = this.facade.bookingToEdit();
      this.model.set({
        patientName: booking?.patientName ?? '',
        patientPhoneNumber: booking?.patientPhoneNumber ?? '',
        patientAddress: booking?.patientAddress ?? '',
        paymentMethod: booking?.paymentMethod?.toString() ?? PaymentMethod.Cash.toString(),
      });
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.bookingForm().invalid()) {
      this.bookingForm().markAsTouched();
      return;
    }
    const booking = {
      ...this.model(),
      paymentMethod: Number(this.model().paymentMethod) as PaymentMethod,
    };

    void this.facade.saveBooking(booking);
  }
}
