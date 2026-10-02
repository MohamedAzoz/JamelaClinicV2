import { Component, computed, input, model, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronRight,
  faChevronLeft,
  faAnglesRight,
  faAnglesLeft,
} from '@fortawesome/free-solid-svg-icons';
import { PaginatedResult } from '../../../core/models/PaginatedResult';

export interface PageChangeEvent {
  pageNumber: number;
  pageSize: number;
}

@Component({
  selector: 'app-pagination',
  imports: [FontAwesomeModule],
  templateUrl: './pagination.html',
  host: {
    class: 'block w-full',
  },
})
export class PaginationComponent {
  // Component Inputs & Signal Models
  pageNumber = model<number>(1);
  pageSize = model<number>(10);
  totalCount = input<number>(0);
  totalPages = input<number>(1);
  pageSizeOptions = input<number[]>([5, 10, 20, 50, 100]);
  pagination = input<PaginatedResult<unknown> | null | undefined>(null);
  disabled = input<boolean>(false);

  // Labels for Buttons (RTL Arabic defaults)
  previousLabel = input<string>('السابق');
  nextLabel = input<string>('التالي');
  firstLabel = input<string>('الأولى');
  lastLabel = input<string>('الأخيرة');

  // Display Configuration Toggles
  showPageSize = input<boolean>(true);
  showInfo = input<boolean>(true);
  showFirstLast = input<boolean>(true);

  // Outputs
  // pageSizeChange = output<number>();
  pageChange = output<number>();
  pageEvent = output<PageChangeEvent>();

  // FontAwesome Icons
  readonly faChevronRight = faChevronRight;
  readonly faChevronLeft = faChevronLeft;
  readonly faAnglesRight = faAnglesRight;
  readonly faAnglesLeft = faAnglesLeft;

  // Computed Values derived from PaginatedResult or direct Inputs
  readonly effectivePageNumber = computed(() => {
    const metaPage = this.pagination()?.pageNumber;
    if (metaPage !== undefined && metaPage !== null && metaPage > 0) {
      return metaPage;
    }
    return Math.max(1, this.pageNumber() || 1);
  });

  readonly effectivePageSize = computed(() => {
    const metaSize = this.pagination()?.pageSize;
    if (metaSize !== undefined && metaSize !== null && metaSize > 0) {
      return metaSize;
    }
    return Math.max(1, this.pageSize() || 10);
  });

  readonly effectiveTotalCount = computed(() => {
    const metaTotal = this.pagination()?.totalCount;
    if (metaTotal !== undefined && metaTotal !== null) {
      return metaTotal;
    }
    return Math.max(0, this.totalCount() || 0);
  });

  readonly effectiveTotalPages = computed(() => {
    const metaPages = this.pagination()?.totalPages;
    if (metaPages !== undefined && metaPages !== null && metaPages > 0) {
      return metaPages;
    }

    const total = this.effectiveTotalCount();
    const size = this.effectivePageSize();

    if (total > 0 && size > 0) {
      return Math.ceil(total / size);
    }

    return Math.max(1, this.totalPages() || 1);
  });

  readonly isFirstPage = computed(() => this.effectivePageNumber() <= 1);

  readonly isLastPage = computed(() => this.effectivePageNumber() >= this.effectiveTotalPages());

  readonly startItem = computed(() => {
    const total = this.effectiveTotalCount();
    if (total === 0) return 0;
    return (this.effectivePageNumber() - 1) * this.effectivePageSize() + 1;
  });

  readonly endItem = computed(() => {
    return Math.min(
      this.effectivePageNumber() * this.effectivePageSize(),
      this.effectiveTotalCount(),
    );
  });

  // Navigation Methods
  goToPage(page: number): void {
    if (this.disabled()) return;

    const targetPage = Math.min(Math.max(1, page), this.effectiveTotalPages());
    if (targetPage === this.effectivePageNumber()) return;

    this.pageNumber.set(targetPage);
    this.pageChange.emit(targetPage);
    this.pageEvent.emit({
      pageNumber: targetPage,
      pageSize: this.effectivePageSize(),
    });
  }

  goToPrevious(): void {
    if (!this.isFirstPage()) {
      this.goToPage(this.effectivePageNumber() - 1);
    }
  }

  goToNext(): void {
    if (!this.isLastPage()) {
      this.goToPage(this.effectivePageNumber() + 1);
    }
  }

  goToFirst(): void {
    if (!this.isFirstPage()) {
      this.goToPage(1);
    }
  }

  goToLast(): void {
    if (!this.isLastPage()) {
      this.goToPage(this.effectiveTotalPages());
    }
  }

  onPageSizeChange(event: Event): void {
    if (this.disabled()) return;

    const selectEl = event.target as HTMLSelectElement;
    const newSize = Number(selectEl.value);

    if (newSize > 0 && newSize !== this.effectivePageSize()) {
      this.pageSize.set(newSize);
      // this.pageSizeChange.emit(newSize);

      const targetPage = 1;
      this.pageNumber.set(targetPage);
      this.pageChange.emit(targetPage);

      this.pageEvent.emit({
        pageNumber: targetPage,
        pageSize: newSize,
      });
    }
  }
}
