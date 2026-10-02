import { computed, inject, Service, signal } from '@angular/core';
import { AppMessageService } from '@core/services/app-message-service';
import { Expense } from '../models/Expense';
import { CreateExpense } from '../models/CreateExpense';
import { ReportExpense, TreasuryPeriod, TreasuryType } from '../models/ReportExpense';
import { TreasuryApiService } from './treasury-api.service';
import { firstValueFrom, finalize } from 'rxjs';
import { TreasurySummary } from '../models/TreasurySummary';
import { IdentityService } from '@core/services/identity-service';

@Service()
export class TreasuryFacade {
  private readonly _api = inject(TreasuryApiService);
  private readonly _messages = inject(AppMessageService);
  private readonly _identity = inject(IdentityService);
  private readonly _initialized = signal(false);
  private reportRequestId = 0;
  private summaryRequestId = 0;

  readonly expenses = signal<Expense[]>([]);
  readonly summary = signal<TreasurySummary | null>(null);
  readonly isLoadingReport = signal(false);
  readonly isLoadingSummary = signal(false);
  readonly isExportingExcel = signal(false);
  readonly canExportExcel = computed(
    () => this._identity.isAdmin() || this._identity.isAccountant(),
  );
  readonly loading = computed(() => this.isLoadingReport() || this.isLoadingSummary());
  readonly actionLoading = signal(false);
  readonly typeFilter = signal<TreasuryType | null>(null);
  readonly periodFilter = signal<TreasuryPeriod | null>(null);
  readonly fromDateFilter = signal('');
  readonly toDateFilter = signal('');
  readonly pageNumber = signal(1);
  readonly pageSize = signal(10);
  readonly filters = computed<ReportExpense>(() => ({
    Type: this.typeFilter() ?? undefined,
    Period: this.periodFilter() ?? undefined,
    FromDate: this.fromDateFilter() || undefined,
    ToDate: this.toDateFilter() || undefined,
    PageNumber: this.pageNumber(),
    PageSize: this.pageSize(),
  }));
  readonly totalCount = signal(0);
  readonly totalPages = signal(0);
  readonly selectedExpense = signal<Expense | null>(null);
  readonly isFormModalOpen = signal(false);
  readonly isDeleteModalOpen = signal(false);
  readonly expenseToDelete = signal<Expense | null>(null);
  readonly hasExpenses = computed(() => this.expenses().length > 0);

  initialize(): void {
    this._initialized.set(true);
    this.refreshData();
  }

  refreshData(): void {
    if (!this._initialized()) return;
    const currentFilters = this.filters();
    this.loadReport(currentFilters);
    this.loadSummary(currentFilters);
  }

  async loadReport(filters = this.filters()): Promise<void> {
    const requestId = ++this.reportRequestId;
    this.isLoadingReport.set(true);

    try {
      const response = await firstValueFrom(this._api.getReport(filters));
      if (requestId !== this.reportRequestId) return;
      const report = response?.data;

      this.expenses.set(report?.items ?? []);
      this.totalCount.set(report?.totalCount ?? 0);
      this.totalPages.set(report?.totalPages ?? 0);
    } catch (error) {
      if (requestId !== this.reportRequestId) return;
      this._messages.showHttpError(error, 'تعذر تحميل تقرير المصروفات');
    } finally {
      if (requestId === this.reportRequestId) this.isLoadingReport.set(false);
    }
  }

  async loadSummary(filters = this.filters()): Promise<void> {
    const requestId = ++this.summaryRequestId;
    this.isLoadingSummary.set(true);

    try {
      const response = await firstValueFrom(this._api.getSummary(filters));
      if (requestId !== this.summaryRequestId) return;
      this.summary.set(response?.data ?? null);
    } catch (error) {
      if (requestId !== this.summaryRequestId) return;
      this._messages.showHttpError(error, 'تعذر تحميل ملخص الخزينة');
    } finally {
      if (requestId === this.summaryRequestId) this.isLoadingSummary.set(false);
    }
  }

  async exportExcel(): Promise<void> {
    if (!this.canExportExcel() || this.isExportingExcel()) return;

    this.isExportingExcel.set(true);
    try {
      const blob = await firstValueFrom(this._api.exportExcel(this.filters()));
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `تقرير_الخزينة_${new Date().toISOString().slice(0, 10)}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      this._messages.addSuccessMessage('تم تصدير تقرير الخزينة بنجاح');
    } catch (error) {
      this._messages.showHttpError(error, 'تعذر تصدير تقرير الخزينة');
    } finally {
      this.isExportingExcel.set(false);
    }
  }

  setTypeFilter(type: TreasuryType | null): void {
    this.typeFilter.set(type);
    this.pageNumber.set(1);
    this.refreshData();
  }

  setPeriodFilter(period: TreasuryPeriod | null): void {
    this.periodFilter.set(period);
    if (period !== null) {
      this.fromDateFilter.set('');
      this.toDateFilter.set('');
    }
    this.pageNumber.set(1);
    this.refreshData();
  }

  setDateRangeFilter(fromDate: string, toDate: string): void {
    if (fromDate && toDate && fromDate > toDate) {
      this._messages.addErrorMessage('يجب أن يكون تاريخ البداية قبل تاريخ النهاية أو مساويًا له');
      return;
    }

    this.fromDateFilter.set(fromDate);
    this.toDateFilter.set(toDate);
    if (fromDate || toDate) this.periodFilter.set(null);
    this.pageNumber.set(1);
    this.refreshData();
  }

  async setPage(pageNumber: number): Promise<void> {
    if (pageNumber < 1 || pageNumber > this.totalPages()) return;
    this.pageNumber.set(pageNumber);
    await this.loadReport();
  }

  async setPageSize(pageSize: number): Promise<void> {
    if (!Number.isInteger(pageSize) || pageSize < 1) return;
    this.pageSize.set(pageSize);
    this.pageNumber.set(1);
    await this.loadReport();
  }

  resetAllFilters(): void {
    this.typeFilter.set(null);
    this.periodFilter.set(null);
    this.fromDateFilter.set('');
    this.toDateFilter.set('');
    this.pageNumber.set(1);
    this.refreshData();
  }

  openCreateModal(): void {
    this.selectedExpense.set(null);
    this.isFormModalOpen.set(true);
  }

  openEditModal(expense: Expense): void {
    this.selectedExpense.set(expense);
    this.isFormModalOpen.set(true);
  }

  closeFormModal(): void {
    this.isFormModalOpen.set(false);
    this.selectedExpense.set(null);
  }

  openDeleteModal(expense: Expense): void {
    this.expenseToDelete.set(expense);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.expenseToDelete.set(null);
  }

  createExpense(expense: CreateExpense): void {
    this.runMutation(this._api.postExpense(expense), 'تمت إضافة المصروف بنجاح');
  }

  updateExpense(id: number, expense: CreateExpense): void {
    this.runMutation(this._api.putExpense(id, expense), 'تم تعديل المصروف بنجاح');
  }

  deleteExpense(id: number): void {
    this.runMutation(this._api.deleteExpense(id), 'تم حذف المصروف بنجاح', true);
  }

  private runMutation(
    request: ReturnType<TreasuryApiService['postExpense']>,
    successMessage: string,
    isDelete = false,
  ): void {
    this.actionLoading.set(true);
    request.pipe(finalize(() => this.actionLoading.set(false))).subscribe({
      next: (response) => {
        if (!response?.isSuccess) {
          this._messages.addErrorMessage(response?.message || 'تعذر تنفيذ العملية');
          return;
        }
        this._messages.addSuccessMessage(response.message || successMessage);
        if (isDelete) this.closeDeleteModal();
        else this.closeFormModal();
        this.loadReport();
        this.loadSummary();
      },
      error: (error) => this._messages.showHttpError(error, 'تعذر تنفيذ عملية المصروف'),
    });
  }
}
