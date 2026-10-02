import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFlask, faPlus, faRotate } from '@fortawesome/free-solid-svg-icons';
import { MaterialsFacade } from '../../services/materials.facade';

@Component({
  selector: 'app-materials-header',
  imports: [FontAwesomeModule],
  template: `
    <header
      class="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-primary/20 bg-surface p-6 shadow-sm"
    >
      <div class="flex items-center gap-3">
        <span
          class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"
          ><fa-icon [icon]="icons.flask"
        /></span>
        <div>
          <h1 id="materials-heading" tabindex="-1" class="text-2xl font-bold text-text">
            إدارة المواد والمستحضرات
          </h1>
          <p class="mt-1 text-sm text-text-muted">المواد الطبية والأدوية ومستحضرات التجميل</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          (click)="facade.loadMaterials()"
          [disabled]="facade.loading() || facade.actionLoading()"
          class="rounded-xl border border-primary/20 bg-surface px-4 py-3 text-sm font-semibold text-text disabled:opacity-50"
        >
          <fa-icon [icon]="icons.refresh" class="me-2" />تحديث
        </button>
        <button
          type="button"
          (click)="facade.openCreate()"
          [disabled]="facade.actionLoading()"
          class="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-50"
        >
          <fa-icon [icon]="icons.plus" class="me-2" />إضافة مادة
        </button>
      </div>
    </header>
  `,
})
export class MaterialsHeaderComponent {
  readonly facade = inject(MaterialsFacade);
  readonly icons = { flask: faFlask, plus: faPlus, refresh: faRotate };
}
