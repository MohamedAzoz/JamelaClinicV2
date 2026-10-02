import { computed, DestroyRef, inject, Service, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AppMessageService } from '@core/services/app-message-service';
import { IdentityService } from '@core/services/identity-service';
import { DoctorApiService } from '@features/doctors/services/doctor-api.service';
import { Doctor } from '@features/doctors/models/Doctor';
import { DoctorWalletApiService } from './doctor-wallet-api.service';
import { DoctorWalletFilter } from '../models/DoctorWalletFilter';
import { DoctorWalletTransaction } from '../models/DoctorWalletTransaction';
import { DoctorWalletSummary } from '../models/DoctorWalletSummary';
import { DoctorWalletReport } from '../models/DoctorWalletReport';
import { Period } from '../models/Period';
import { WalletTransactionType } from '../models/WalletTransactionType';

export type WalletAction = WalletTransactionType.Deposit | WalletTransactionType.Withdrawal;
export interface WalletActionTarget {
  action: WalletAction;
  doctorId: string;
  doctorName: string;
}

@Service()
export class DoctorWalletFacade {
  private readonly api = inject(DoctorWalletApiService);
  private readonly doctorApi = inject(DoctorApiService);
  private readonly identity = inject(IdentityService);
  private readonly messages = inject(AppMessageService);
  private readonly destroyRef = inject(DestroyRef);
  private reportRequestId = 0;
  private summaryRequestId = 0;
  private transactionDetailsRequestId = 0;

  readonly canManage = computed(() => this.identity.isAdmin() || this.identity.isAccountant());
  readonly isDoctor = computed(() => this.identity.isDoctor());
  readonly canView = computed(
    () => this.canManage() || (this.isDoctor() && !!this.identity.userId()),
  );
  readonly accountLabel = computed(() =>
    this.isDoctor()
      ? this.identity.userName() || 'حسابي'
      : this.summary()?.doctorName || 'جميع الأطباء',
  );
  readonly transactions = signal<DoctorWalletReport[]>([]);
  readonly transactionDetails = signal<DoctorWalletReport | null>(null);
  readonly loadingTransactionDetails = signal(false);
  readonly transactionDetailsError = signal('');
  readonly summary = signal<DoctorWalletSummary | null>(null);
  readonly doctors = signal<Doctor[]>([]);
  readonly loadingReport = signal(false);
  readonly loadingSummary = signal(false);
  readonly loadingDoctors = signal(false);
  readonly reportError = signal('');
  readonly summaryError = signal('');
  readonly doctorsError = signal('');
  readonly actionError = signal('');
  readonly actionLoading = signal(false);
  readonly actionTarget = signal<WalletActionTarget | null>(null);
  readonly doctorIdFilter = signal('');
  readonly periodFilter = signal<Period | null>(null);
  readonly fromDateFilter = signal('');
  readonly toDateFilter = signal('');
  readonly pageNumber = signal(1);
  readonly pageSize = signal(10);
  readonly totalCount = signal(0);
  readonly totalPages = signal(0);
  readonly loading = computed(() => this.loadingReport() || this.loadingSummary());
  readonly filters = computed<DoctorWalletFilter>(() => ({
    DoctorId: this.isDoctor() ? this.identity.userId() : this.doctorIdFilter() || undefined,
    Period: this.periodFilter(),
    FromDate: this.fromDateFilter() || undefined,
    ToDate: this.toDateFilter() || undefined,
    PageNumber: this.pageNumber(),
    PageSize: this.pageSize(),
  }));

  initialize(): void {
    if (!this.canView()) return;
    if (this.canManage()) void this.loadDoctors();
    this.refreshData();
  }

  refreshData(): void {
    if (!this.canView()) return;
    void this.loadTransactions();
    void this.loadSummary();
  }

  async loadDoctors(): Promise<void> {
    if (!this.canManage()) return;
    this.loadingDoctors.set(true);
    this.doctorsError.set('');
    try {
      const response = await firstValueFrom(this.doctorApi.getAllDoctors());
      if (this.destroyRef.destroyed) return;
      if (!response.isSuccess) throw new Error(response.message);
      this.doctors.set(response.data ?? []);
    } catch {
      if (!this.destroyRef.destroyed) this.doctorsError.set('تعذر تحميل قائمة الأطباء');
    } finally {
      if (!this.destroyRef.destroyed) this.loadingDoctors.set(false);
    }
  }

  async loadTransactions(): Promise<void> {
    if (!this.canView()) return;
    const requestId = ++this.reportRequestId;
    this.loadingReport.set(true);
    this.reportError.set('');
    try {
      const response = await firstValueFrom(this.api.getTransactionsReport(this.filters()));
      if (requestId !== this.reportRequestId || this.destroyRef.destroyed) return;
      if (!response.isSuccess) throw new Error(response.message);
      this.transactions.set(response.data?.items ?? []);
      this.totalCount.set(response.data?.totalCount ?? 0);
      this.totalPages.set(response.data?.totalPages ?? 0);
    } catch {
      if (requestId !== this.reportRequestId || this.destroyRef.destroyed) return;
      this.transactions.set([]);
      this.totalCount.set(0);
      this.totalPages.set(0);
      this.reportError.set('تعذر تحميل الحركات المالية. حاول مرة أخرى.');
    } finally {
      if (requestId === this.reportRequestId && !this.destroyRef.destroyed)
        this.loadingReport.set(false);
    }
  }

  async loadTransactionDetails(id: number): Promise<void> {
    const requestId = ++this.transactionDetailsRequestId;
    this.transactionDetails.set(null);
    this.transactionDetailsError.set('');

    if (!Number.isSafeInteger(id) || id <= 0) {
      this.transactionDetailsError.set('رقم الحركة غير صحيح.');
      this.loadingTransactionDetails.set(false);
      return;
    }

    this.loadingTransactionDetails.set(true);
    try {
      const response = await firstValueFrom(this.api.getTransactionById(id));
      if (requestId !== this.transactionDetailsRequestId || this.destroyRef.destroyed) return;
      if (!response.isSuccess || !response.data) throw new Error(response.message);
      this.transactionDetails.set(response.data);
    } catch {
      if (requestId !== this.transactionDetailsRequestId || this.destroyRef.destroyed) return;
      this.transactionDetailsError.set('تعذر تحميل تفاصيل الحركة. تحقق من الرقم وحاول مرة أخرى.');
    } finally {
      if (requestId === this.transactionDetailsRequestId && !this.destroyRef.destroyed) {
        this.loadingTransactionDetails.set(false);
      }
    }
  }

  async loadSummary(): Promise<void> {
    if (!this.canView()) return;
    const requestId = ++this.summaryRequestId;
    this.loadingSummary.set(true);
    this.summaryError.set('');
    try {
      const response = await firstValueFrom(this.api.getSummaryReport(this.filters()));
      if (requestId !== this.summaryRequestId || this.destroyRef.destroyed) return;
      if (!response.isSuccess) throw new Error(response.message);
      this.summary.set(response.data ?? null);
    } catch {
      if (requestId !== this.summaryRequestId || this.destroyRef.destroyed) return;
      this.summary.set(null);
      this.summaryError.set('تعذر تحميل ملخص الحسابات. حاول مرة أخرى.');
    } finally {
      if (requestId === this.summaryRequestId && !this.destroyRef.destroyed)
        this.loadingSummary.set(false);
    }
  }

  setDoctorFilter(doctorId: string): void {
    if (!this.canManage()) return;
    this.doctorIdFilter.set(doctorId);
    this.applyFilters();
  }

  setPeriodFilter(period: Period | null): void {
    this.periodFilter.set(period);
    if (period !== null) {
      this.fromDateFilter.set('');
      this.toDateFilter.set('');
    }
    this.applyFilters();
  }

  setDateRangeFilter(fromDate: string, toDate: string): void {
    if (fromDate && toDate && fromDate > toDate) return;
    this.fromDateFilter.set(fromDate);
    this.toDateFilter.set(toDate);
    if (fromDate || toDate) this.periodFilter.set(null);
    this.applyFilters();
  }

  resetFilters(): void {
    this.doctorIdFilter.set('');
    this.periodFilter.set(null);
    this.fromDateFilter.set('');
    this.toDateFilter.set('');
    this.applyFilters();
  }

  setPage(page: number): void {
    if (
      !Number.isInteger(page) ||
      page < 1 ||
      page > this.totalPages() ||
      page === this.pageNumber()
    )
      return;
    this.pageNumber.set(page);
    void this.loadTransactions();
  }

  setPageSize(size: number): void {
    if (![10, 25, 50].includes(size)) return;
    this.pageSize.set(size);
    this.pageNumber.set(1);
    void this.loadTransactions();
  }

  openTransaction(
    action: WalletAction,
    doctor?: Pick<DoctorWalletReport, 'doctorId' | 'doctorName'>,
  ): void {
    if (!this.canManage() || this.actionLoading()) return;
    this.actionError.set('');
    this.actionTarget.set({
      action,
      doctorId: doctor?.doctorId ?? '',
      doctorName: doctor?.doctorName ?? '',
    });
  }

  closeTransaction(): void {
    if (this.actionLoading()) return;
    this.actionTarget.set(null);
    this.actionError.set('');
  }

  async submitTransaction(transaction: DoctorWalletTransaction): Promise<void> {
    const target = this.actionTarget();
    if (!this.canManage() || !target || this.actionLoading()) return;
    this.actionError.set('');
    if (
      !transaction.doctorId ||
      (target.doctorId && target.doctorId !== transaction.doctorId) ||
      !Number.isFinite(transaction.amount) ||
      transaction.amount <= 0 ||
      Math.abs(transaction.amount * 100 - Math.round(transaction.amount * 100)) > 0.000001 ||
      !transaction.description.trim()
    ) {
      this.actionError.set('اختر الطبيب وأدخل مبلغًا صحيحًا أكبر من صفر ووصفًا للعملية.');
      return;
    }
    this.actionLoading.set(true);
    try {
      const payload = { ...transaction, description: transaction.description.trim() };
      const response = await firstValueFrom(
        target.action === WalletTransactionType.Deposit
          ? this.api.deposit(payload)
          : this.api.withdraw(payload),
      );
      if (this.destroyRef.destroyed) return;
      if (!response.isSuccess || response.data !== true) {
        this.actionError.set(
          response.message || 'تعذر تنفيذ العملية. راجع البيانات وحاول مرة أخرى.',
        );
        return;
      }
      this.messages.addSuccessMessage(
        target.action === WalletTransactionType.Deposit
          ? 'تمت إضافة الرصيد بنجاح'
          : 'تم سحب الرصيد بنجاح',
      );
      this.pageNumber.set(1);
      this.refreshData();
    } catch (error: any) {
      this.messages.addErrorMessage(error.error?.message || 'تعذر تنفيذ الحركة المالية');
      if (this.destroyRef.destroyed) return;
    } finally {
      if (!this.destroyRef.destroyed) this.actionLoading.set(false);
      this.actionTarget.set(null);
    }
  }

  private applyFilters(): void {
    this.pageNumber.set(1);
    this.refreshData();
  }

  deleteTransaction(id: number): void {
    if (this.actionLoading()) return;
    this.actionLoading.set(true);
    this.api.deleteTransaction(id).subscribe({
      next: (response) => {
        if (!response.isSuccess) {
          this.messages.addErrorMessage(response.message || 'تعذر حذف الحركة المالية');
          return;
        }
        this.messages.addSuccessMessage('تم حذف الحركة المالية بنجاح');
        this.refreshData();
      },
      error: (error: any) => {
        {
          this.messages.addErrorMessage(error.error?.message || 'تعذر حذف الحركة المالية');
        }
      },
      complete: () => {
        if (!this.destroyRef.destroyed) this.actionLoading.set(false);
      },
    });
  }
}
