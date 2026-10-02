import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarCheck,
  faArrowRight,
  faReceipt,
  faCoins,
  faUserCheck,
  faClock,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { Location } from '@angular/common';

@Component({
  selector: 'app-schedule-appointments-header',
  imports: [FontAwesomeModule],
  templateUrl: './schedule-appointments-header.html',
})
export class ScheduleAppointmentsHeaderComponent {
  readonly facade = inject(AppointmentFacade);
  readonly location = inject(Location);

  readonly faCalendarCheck = faCalendarCheck;
  readonly faArrowRight = faArrowRight;
  readonly faReceipt = faReceipt;
  readonly faCoins = faCoins;
  readonly faUserCheck = faUserCheck;
  readonly faClock = faClock;
  readonly faTimesCircle = faTimesCircle;

  onBackClick(): void {
    this.location.back();
  }
}
