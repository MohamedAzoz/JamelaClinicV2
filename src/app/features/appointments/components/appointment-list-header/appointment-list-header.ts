import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarCheck,
  faPlus,
  faFileExcel,
  faSpinner,
  faReceipt,
  faCoins,
  faUserCheck,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';

@Component({
  selector: 'app-appointment-list-header',
  imports: [FontAwesomeModule],
  templateUrl: './appointment-list-header.html',
})
export class AppointmentListHeaderComponent {
  readonly facade = inject(AppointmentFacade);

  readonly faCalendarCheck = faCalendarCheck;
  readonly faPlus = faPlus;
  readonly faFileExcel = faFileExcel;
  readonly faSpinner = faSpinner;
  readonly faReceipt = faReceipt;
  readonly faCoins = faCoins;
  readonly faUserCheck = faUserCheck;
  readonly faTimesCircle = faTimesCircle;
}
