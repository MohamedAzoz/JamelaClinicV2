import { Component, inject, OnInit, signal } from '@angular/core';
import { AppointmentFacade } from '../../services/appointment.facade';
import { BookingHeaderComponent } from '../../components/booking-header/booking-header';
import { BookingFormComponent, BookingFormModel } from '../../components/booking-form/booking-form';
import { BookingSummaryCardComponent } from '../../components/booking-summary-card/booking-summary-card';
import { BookingSuccessModalComponent } from '../../components/booking-success-modal/booking-success-modal';

@Component({
  selector: 'app-appointment-booking',
  providers: [AppointmentFacade],
  imports: [
    BookingHeaderComponent,
    BookingFormComponent,
    BookingSummaryCardComponent,
    BookingSuccessModalComponent,
  ],
  templateUrl: './appointment-booking.html',
})
export class AppointmentBookingPage implements OnInit {
  readonly facade = inject(AppointmentFacade);

  // Synchronized form data model for live preview summary
  readonly currentFormValue = signal<BookingFormModel | null>(null);

  ngOnInit(): void {
    this.facade.initBooking();
  }

  onFormValueChange(value: BookingFormModel): void {
    this.currentFormValue.set(value);
  }
}
