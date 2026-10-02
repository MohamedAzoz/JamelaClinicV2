import { Component, input, inject, computed } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarCheck,
  faUser,
  faUserMd,
  faPhone,
  faMapMarkerAlt,
  faReceipt,
  faCheckCircle,
  faTimesCircle,
  faClinicMedical,
  faCoins,
  faStethoscope,
} from '@fortawesome/free-solid-svg-icons';
import { BookingFormModel } from '../booking-form/booking-form';
import { AppointmentFacade } from '../../services/appointment.facade';
import { DatePipe, DecimalPipe } from '@angular/common';
import { calculateAppointmentPricing } from '../../utils/appointment-pricing';

@Component({
  selector: 'app-booking-summary-card',
  imports: [FontAwesomeModule, DatePipe, DecimalPipe],
  templateUrl: './booking-summary-card.html',
})
export class BookingSummaryCardComponent {
  readonly facade = inject(AppointmentFacade);

  // Form input model passed from parent or binding
  readonly formData = input<BookingFormModel | null>(null);

  // FontAwesome Icons
  readonly faCalendarCheck = faCalendarCheck;
  readonly faUser = faUser;
  readonly faUserMd = faUserMd;
  readonly faPhone = faPhone;
  readonly faMapMarkerAlt = faMapMarkerAlt;
  readonly faReceipt = faReceipt;
  readonly faCheckCircle = faCheckCircle;
  readonly faTimesCircle = faTimesCircle;
  readonly faClinicMedical = faClinicMedical;
  readonly faCoins = faCoins;
  readonly faStethoscope = faStethoscope;

  readonly selectedDoctor = computed(() => this.facade.selectedDoctor());
  readonly pricing = computed(() =>
    calculateAppointmentPricing(
      this.formData()?.consultationFee ?? 0,
      this.formData()?.discountAmount ?? 0,
      this.selectedDoctor()?.doctorPercentage,
    ),
  );

  readonly selectedSchedule = computed(() => {
    const id = this.formData()?.doctorScheduleId;
    if (!id) return null;
    return this.facade.schedules().find((s) => s.id === Number(id)) ?? null;
  });

  readonly visitTypeName = computed(() => {
    const type = Number(this.formData()?.visitType);
    switch (type) {
      case 1:
        return 'كشف جديد';
      case 2:
        return 'إعادة';
      case 3:
        return 'جلسات';
      case 4:
        return 'ليزر';
      case 5:
        return 'فراكشنال';
      default:
        return 'كشف جديد';
    }
  });
}
