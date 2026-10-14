import { Component, computed, inject, signal } from '@angular/core';
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
  faCreditCard,
  faChevronDown,
  faBan,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { Period } from '../../models/Period';
import { AppointmentStatus } from '../../models/AppointmentStatus';
import { PaymentMethod } from '../../models/PaymentMethod';

@Component({
  selector: 'app-appointment-filter',
  imports: [FontAwesomeModule],
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
  readonly faCreditCard = faCreditCard;
  readonly faChevronDown = faChevronDown;
  readonly faBan = faBan;

  readonly PeriodEnum = Period;
  readonly AppointmentStatusEnum = AppointmentStatus;
  readonly PaymentMethodEnum = PaymentMethod;

  // Local inputs for custom date range
  readonly fromDate = signal<string>('');
  readonly toDate = signal<string>('');

  /** Total count of currently active filters */
  readonly activeFiltersCount = computed(() => {
    let count = 0;
    if (this.facade.periodFilter() !== null) count++;
    if (this.facade.fromDateFilter() || this.facade.toDateFilter()) count++;
    if (this.facade.doctorIdFilter()) count++;
    if (this.facade.employeeIdFilter()) count++;
    if (this.facade.statusFilter() !== null) count++;
    if (this.facade.paymentMethodFilter() !== null) count++;
    return count;
  });

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

  onPaymentMethodChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    const method = val ? (Number(val) as PaymentMethod) : null;
    this.facade.setPaymentMethodFilter(method || null);
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

  formatMoney(value: number | undefined | null): string {
    return `${(value ?? 0).toLocaleString('ar-EG')} ج.م`;
  }

  formatMoneyExact(value: number | undefined | null): string {
    return `${(value ?? 0).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م`;
  }

  formatCount(value: number | undefined | null): string {
    return (value ?? 0).toLocaleString('ar-EG');
  }
}
