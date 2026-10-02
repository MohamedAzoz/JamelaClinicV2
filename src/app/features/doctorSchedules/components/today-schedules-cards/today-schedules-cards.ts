import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUserMd,
  faHospital,
  faCalendarDay,
  faUsersViewfinder,
  faPlus,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faArrowLeft,
  faStethoscope,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorScheduleFacade } from '../../services/doctor-schedule.facade';
import { IdentityService } from '@core/services/identity-service';

@Component({
  selector: 'app-today-schedules-cards',
  imports: [FontAwesomeModule, DatePipe, RouterLink],
  templateUrl: './today-schedules-cards.html',
})
export class TodaySchedulesCardsComponent {
  readonly facade = inject(DoctorScheduleFacade);
  readonly identity = inject(IdentityService);

  readonly IsAdmian = computed(() => this.identity.isAdmin());

  readonly faUserMd = faUserMd;
  readonly faHospital = faHospital;
  readonly faCalendarDay = faCalendarDay;
  readonly faUsersViewfinder = faUsersViewfinder;
  readonly faPlus = faPlus;
  readonly faSpinner = faSpinner;
  readonly faCheckCircle = faCheckCircle;
  readonly faTimesCircle = faTimesCircle;
  readonly faArrowLeft = faArrowLeft;
  readonly faStethoscope = faStethoscope;
}
