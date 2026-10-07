import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarDays,
  faCheck,
  faSpinner,
  faUserDoctor,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { SpecialOfferBookingReportItem } from '../../models/CreateSpecialOfferBookingResponse';
import { SpecialOffersFacade } from '../../services/special-offers.facade';

@Component({
  selector: 'app-special-offer-convert-booking',
  imports: [DatePipe, FormsModule, DecimalPipe, FontAwesomeModule],
  templateUrl: './special-offer-convert-booking.html',
})
export class SpecialOfferConvertBookingComponent {
  readonly booking = input.required<SpecialOfferBookingReportItem>();

  constructor(readonly facade: SpecialOffersFacade) {}

  onDoctorChange(event: Event): void {
    const doctorId = (event.target as HTMLSelectElement).value;
    void this.facade.selectConversionDoctor(doctorId);
  }

  setSchedule(event: Event): void {
    const scheduleId = Number((event.target as HTMLSelectElement).value);
    this.facade.conversionScheduleId.set(Number.isSafeInteger(scheduleId) ? scheduleId : null);
  }

  setClinic(event: Event): void {
    const clinicId = Number((event.target as HTMLSelectElement).value);
    this.facade.conversionDoctorClinicId.set(Number.isSafeInteger(clinicId) && clinicId > 0 ? clinicId : null);
  }

  readonly faCalendarDays = faCalendarDays;
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;
  readonly faUserDoctor = faUserDoctor;
  readonly faXmark = faXmark;
}
