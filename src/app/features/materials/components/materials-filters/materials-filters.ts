import { Component, inject } from '@angular/core';
import { MaterialsFacade } from '../../services/materials.facade';

@Component({
  selector: 'app-materials-filters',
  template: `
    <section
      aria-label="تصفية المواد"
      class="flex flex-wrap items-end gap-4 rounded-2xl border border-primary/10 bg-surface p-5"
    >
      <div class="w-full sm:w-64">
        <label for="material-status" class="mb-2 block text-sm font-semibold text-text"
          >حالة المادة</label
        >
        <select
          id="material-status"
          [value]="
            facade.isActiveFilter() === null ? 'all' : facade.isActiveFilter() ? 'true' : 'false'
          "
          (change)="changeStatus($event)"
          [disabled]="facade.actionLoading()"
          class="w-full rounded-xl border border-primary/20 bg-main-bg px-3 py-3 text-sm text-text"
        >
          <option value="all">جميع الحالات</option>
          <option value="true">نشطة</option>
          <option value="false">غير نشطة</option>
        </select>
      </div>
      @if (facade.isActiveFilter() !== null) {
        <button
          type="button"
          (click)="facade.setStatusFilter(null)"
          [disabled]="facade.actionLoading()"
          class="rounded-xl border border-primary/20 px-4 py-3 text-sm font-semibold text-text"
        >
          إعادة ضبط الفلتر
        </button>
      }
    </section>
  `,
})
export class MaterialsFiltersComponent {
  readonly facade = inject(MaterialsFacade);
  changeStatus(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.facade.setStatusFilter(value === 'all' ? null : value === 'true');
  }
}
