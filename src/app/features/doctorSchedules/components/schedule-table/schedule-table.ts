import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarDay,
  faCalendarCheck,
  faPenToSquare,
  faTrashCan,
  faToggleOn,
  faToggleOff,
  faSpinner,
  faUsersViewfinder,
  faUserMd,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorScheduleFacade } from '../../services/doctor-schedule.facade';

@Component({
  selector: 'app-schedule-table',
  imports: [DatePipe, RouterLink, FontAwesomeModule],
  templateUrl: './schedule-table.html',
})
export class ScheduleTableComponent {
  public facade = inject(DoctorScheduleFacade);

  readonly faCalendarDay = faCalendarDay;
  readonly faCalendarCheck = faCalendarCheck;
  readonly faPenToSquare = faPenToSquare;
  readonly faTrashCan = faTrashCan;
  readonly faToggleOn = faToggleOn;
  readonly faToggleOff = faToggleOff;
  readonly faSpinner = faSpinner;
  readonly faUsersViewfinder = faUsersViewfinder;
  readonly faUserMd = faUserMd;
}
