import { Component, computed, inject, linkedSignal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { DoctorWalletFacade } from '../../services/doctor-wallet.facade';
import { Period } from '../../models/Period';

@Component({
  selector: 'app-wallet-filters',
  imports: [FormField, FontAwesomeModule],
  templateUrl: './wallet-filters.html',
})
export class WalletFiltersComponent {
  readonly facade = inject(DoctorWalletFacade);
  readonly Period = Period;
  readonly faFilter = faFilter;
  readonly faRotateLeft = faRotateLeft;
  readonly dates = linkedSignal({
    source: () => ({
      period: this.facade.periodFilter(),
      fromDate: this.facade.fromDateFilter(),
      toDate: this.facade.toDateFilter(),
    }),
    computation: ({ fromDate, toDate }) => ({ fromDate, toDate }),
  });
  readonly dateForm = form(this.dates);
  readonly invalidRange = computed(
    () =>
      !!this.dates().fromDate &&
      !!this.dates().toDate &&
      this.dates().fromDate > this.dates().toDate,
  );

  selectDoctor(event: Event): void {
    this.facade.setDoctorFilter((event.target as HTMLSelectElement).value);
  }

  selectPeriod(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.facade.setPeriodFilter(value ? (Number(value) as Period) : null);
    if (value) this.dates.set({ fromDate: '', toDate: '' });
  }

  applyDates(event: Event): void {
    event.preventDefault();
    if (!this.invalidRange())
      this.facade.setDateRangeFilter(this.dates().fromDate, this.dates().toDate);
  }

  reset(): void {
    this.facade.resetFilters();
    this.dates.set({ fromDate: '', toDate: '' });
  }
}
