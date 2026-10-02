import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUserMd,
  faSearch,
  faRotateRight,
  faCalendarCheck,
  faUsers,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorScheduleFacade } from '../../services/doctor-schedule.facade';

@Component({
  selector: 'app-today-schedules-header',
  imports: [FontAwesomeModule],
  templateUrl: './today-schedules-header.html',
})
export class TodaySchedulesHeaderComponent {
  readonly facade = inject(DoctorScheduleFacade);

  readonly faUserMd = faUserMd;
  readonly faSearch = faSearch;
  readonly faRotateRight = faRotateRight;
  readonly faCalendarCheck = faCalendarCheck;
  readonly faUsers = faUsers;
  readonly faReceipt = faReceipt;

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.facade.setTodaySearchQuery(value);
  }
}
