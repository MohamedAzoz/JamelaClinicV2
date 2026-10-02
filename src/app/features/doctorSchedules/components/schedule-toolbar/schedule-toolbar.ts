import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarPlus,
  faUserMd,
  faCalendarDays,
  faCheckCircle,
  faTimesCircle,
  faStethoscope,
  faFilter,
  faClock,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorScheduleFacade } from '../../services/doctor-schedule.facade';

@Component({
  selector: 'app-schedule-toolbar',
  imports: [FontAwesomeModule],
  templateUrl: './schedule-toolbar.html',
})
export class ScheduleToolbarComponent {
  public facade = inject(DoctorScheduleFacade);

  readonly faCalendarPlus = faCalendarPlus;
  readonly faUserMd = faUserMd;
  readonly faCalendarDays = faCalendarDays;
  readonly faCheckCircle = faCheckCircle;
  readonly faTimesCircle = faTimesCircle;
  readonly faStethoscope = faStethoscope;
  readonly faFilter = faFilter;
  readonly faClock = faClock;
  readonly faUndo = faUndo;

  onDoctorChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select.value) {
      this.facade.selectDoctor(select.value);
    }
  }

  onIsActiveChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'true') {
      this.facade.setIsActiveFilter(true);
    } else if (value === 'false') {
      this.facade.setIsActiveFilter(false);
    } else {
      this.facade.setIsActiveFilter(undefined);
    }
  }

  onOnlyFutureChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'true') {
      this.facade.setOnlyFutureFilter(true);
    } else if (value === 'false') {
      this.facade.setOnlyFutureFilter(false);
    } else {
      this.facade.setOnlyFutureFilter(undefined);
    }
  }
}
