import { Component, computed, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowRight,
  faBan,
  faCheck,
  faCheckCircle,
  faCoins,
  faReceipt,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { AppointmentStatus } from '../../models/AppointmentStatus';
import { AppointmentsMaterial } from '../../models/AppointmentsMaterial';

@Component({
  selector: 'app-appointment-details-header',
  imports: [FontAwesomeModule],
  templateUrl: './appointment-details-header.html',
})
export class AppointmentDetailsHeaderComponent {
  readonly facade = inject(AppointmentFacade);
  private readonly _location = inject(Location);

  readonly appointment = input.required<AppointmentsMaterial>();
  readonly Number = Number;

  readonly faArrowRight = faArrowRight;
  readonly faReceipt = faReceipt;
  readonly faCoins = faCoins;
  readonly faCheck = faCheck;
  readonly faBan = faBan;
  readonly faCheckCircle = faCheckCircle;
  readonly faSpinner = faSpinner;

  readonly statusBadgeClass = computed(() => {
    const status = this.appointment()?.status;
    switch (status) {
      case 'Unpaid':
        return 'bg-warning/10 text-warning border border-warning/20';
      case 'InProgress':
        return 'bg-accent/10 text-accent border border-accent/20';
      case 'Completed':
        return 'bg-success/10 text-success border border-success/20';
      case 'Cancelled':
        return 'bg-danger/10 text-danger border border-danger/20';
      default:
        return 'bg-warning/10 text-warning border border-warning/20';
    }
  });

  //"status": "Cancelled", //
  getStatusName(status: string | null | undefined): string {
    switch (status) {
      case 'Unpaid':
        return 'غير مدفوع';
      case 'InProgress':
        return 'قيد المعاينة';
      case 'Completed':
        return 'مكتمل';
      case 'Cancelled':
        return 'ملغى';
      default:
        return 'غير مدفوع';
    }
  }

  goBack(): void {
    this._location.back();
  }

  pay(): void {
    this.facade.payAppointment(this.appointment().id);
  }

  complete(): void {
    this.facade.completeAppointment(this.appointment().id);
  }

  cancel(): void {
    this.facade.cancelAppointment(this.appointment().id);
  }
}
