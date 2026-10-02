import { Component, computed, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter, faGift, faPlus, faRotate } from '@fortawesome/free-solid-svg-icons';
import { SpecialOffersFacade } from '../../services/special-offers.facade';

@Component({
  selector: 'app-special-offers-header',
  imports: [FontAwesomeModule],
  template: `
    <header
      class="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-primary/20 bg-surface p-6 shadow-sm mb-6"
      dir="rtl"
    >
      <div class="flex items-center gap-3">
        <span
          class="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"
        >
          <fa-icon [icon]="faGift" class="text-xl" />
        </span>
        <div>
          <h1 class="text-xl font-bold sm:text-2xl text-text">إدارة الخصومات والعروض</h1>
          <p class="mt-1 text-sm text-text-muted">متابعة العروض وحجوزاتها وحالتها</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2">
          <label
            for="special-offer-status-filter"
            class="flex items-center gap-1 text-xs font-bold text-text"
          >
            <fa-icon [icon]="faFilter" class="text-primary" /> الحالة:
          </label>
          <select
            id="special-offer-status-filter"
            [value]="filterValue()"
            (change)="onFilterChange($event)"
            class="min-h-10 cursor-pointer rounded-xl border border-primary/20 bg-surface px-3 py-2 text-xs font-semibold text-text transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">جميع العروض</option>
            <option value="true">المفعلة فقط</option>
            <option value="false">غير المفعلة فقط</option>
          </select>
        </div>

        <button
          type="button"
          (click)="facade.loadOffers()"
          [disabled]="facade.isLoading()"
          class="inline-flex min-h-10 items-center gap-2 rounded-xl border border-primary/20 bg-surface px-3.5 py-2 text-sm font-semibold transition hover:bg-primary/5 disabled:opacity-50"
        >
          <fa-icon [icon]="faRotate" [class.animate-spin]="facade.isLoading()" /> تحديث
        </button>

        @if (facade.isManager()) {
          <button
            type="button"
            (click)="facade.openCreateForm()"
            class="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <fa-icon [icon]="faPlus" /> إضافة خصم
          </button>
        }
      </div>
    </header>
  `,
})
export class SpecialOffersHeaderComponent {
  readonly facade = inject(SpecialOffersFacade);

  readonly faGift = faGift;
  readonly faPlus = faPlus;
  readonly faRotate = faRotate;
  readonly faFilter = faFilter;

  readonly filterValue = computed(() => {
    const status = this.facade.activeStatusFilter();
    if (status === true) return 'true';
    if (status === false) return 'false';
    return '';
  });

  onFilterChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    let status: boolean | undefined = undefined;
    if (val === 'true') status = true;
    else if (val === 'false') status = false;
    this.facade.setActiveStatusFilter(status);
  }
}
