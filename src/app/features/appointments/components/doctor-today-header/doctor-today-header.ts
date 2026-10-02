import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarCheck,
  faCheckCircle,
  faClock,
  faListOl,
  faRotateRight,
  faStethoscope,
  faTimesCircle,
  faUserMd,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';

@Component({
  selector: 'app-doctor-today-header',
  imports: [FontAwesomeModule, DatePipe],
  templateUrl: './doctor-today-header.html',
})
export class DoctorTodayHeaderComponent {
  readonly facade = inject(AppointmentFacade);
  readonly todayDate = new Date();

  // Icons
  readonly faUserMd = faUserMd;
  readonly faStethoscope = faStethoscope;
  readonly faCalendarCheck = faCalendarCheck;
  readonly faCheckCircle = faCheckCircle;
  readonly faClock = faClock;
  readonly faTimesCircle = faTimesCircle;
  readonly faRotateRight = faRotateRight;
  readonly faListOl = faListOl;

  refresh(): void {
    this.facade.loadMyTodayAppointments();
  }
}
