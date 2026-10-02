import { Component, computed, inject, linkedSignal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendarAlt, faFilter, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { TreasuryFacade } from '../../services/treasury.facade';
import { TreasuryPeriod, TreasuryType } from '../../models/ReportExpense';

@Component({
  selector: 'app-treasury-filters',
  imports: [FormField, FontAwesomeModule],
  templateUrl: './treasury-filters.html',
})
export class TreasuryFiltersComponent {
  readonly facade = inject(TreasuryFacade);
  readonly faCalendarAlt = faCalendarAlt;
  readonly faFilter = faFilter;
  readonly faRotateLeft = faRotateLeft;
  readonly TreasuryPeriod = TreasuryPeriod;
  readonly TreasuryType = TreasuryType;

  readonly dateRange = linkedSignal({
    source: () => ({
      period: this.facade.periodFilter(),
      fromDate: this.facade.fromDateFilter(),
      toDate: this.facade.toDateFilter(),
    }),
    computation: ({ fromDate, toDate }) => ({ fromDate, toDate }),
  });
  readonly dateForm = form(this.dateRange);
  readonly invalidDateRange = computed(() => {
    const { fromDate, toDate } = this.dateRange();
    return !!fromDate && !!toDate && fromDate > toDate;
  });

  onTypeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.facade.setTypeFilter(value ? (Number(value) as TreasuryType) : null);
  }

  onPeriodSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.facade.setPeriodFilter(value ? (Number(value) as TreasuryPeriod) : null);
    if (value) this.dateRange.set({ fromDate: '', toDate: '' });
  }

  onDateRangeApply(event: Event): void {
    event.preventDefault();
    if (this.invalidDateRange()) return;
    const { fromDate, toDate } = this.dateRange();
    this.facade.setDateRangeFilter(fromDate, toDate);
  }

  resetAll(): void {
    this.facade.resetAllFilters();
    this.dateRange.set({ fromDate: '', toDate: '' });
  }
}
