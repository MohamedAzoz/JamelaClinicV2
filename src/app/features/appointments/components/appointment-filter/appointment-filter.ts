import { Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarAlt,
  faUndo,
  faUserMd,
  faUserTie,
  faFilter,
  faCoins,
  faReceipt,
  faCheckCircle,
  faClock,
  faTimesCircle,
  faBuilding,
  faStethoscope,
  faChartPie,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { Period } from '../../models/Period';
import { AppointmentStatus } from '../../models/AppointmentStatus';

import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-appointment-filter',
  imports: [FontAwesomeModule, DecimalPipe],
  templateUrl: './appointment-filter.html',
})
export class AppointmentFilterComponent {
  readonly facade = inject(AppointmentFacade);

  // FontAwesome Icons
  readonly faCalendarAlt = faCalendarAlt;
  readonly faUndo = faUndo;
  readonly faUserMd = faUserMd;
  readonly faUserTie = faUserTie;
  readonly faFilter = faFilter;
  readonly faCoins = faCoins;
  readonly faReceipt = faReceipt;
  readonly faCheckCircle = faCheckCircle;
  readonly faClock = faClock;
  readonly faTimesCircle = faTimesCircle;
  readonly faBuilding = faBuilding;
  readonly faStethoscope = faStethoscope;
  readonly faChartPie = faChartPie;

  readonly PeriodEnum = Period;
  readonly AppointmentStatusEnum = AppointmentStatus;

  // Local inputs for custom date range
  readonly fromDate = signal<string>('');
  readonly toDate = signal<string>('');

  onDoctorChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.facade.setDoctorIdFilter(val);
  }

  onEmployeeChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.facade.setEmployeeIdFilter(val);
  }

  onStatusChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    const status = val ? (Number(val) as AppointmentStatus) : null;
    this.facade.setStatusFilter(status || null);
  }

  onPeriodSelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    const period = val ? (Number(val) as Period) : null;
    this.facade.setPeriodFilter(period || null);
  }

  onDateRangeApply(): void {
    this.facade.setDateRangeFilter(this.fromDate(), this.toDate());
  }

  resetAll(): void {
    this.fromDate.set('');
    this.toDate.set('');
    this.facade.resetAllFilters();
  }
}
