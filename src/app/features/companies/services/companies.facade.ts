import { computed, inject, Service, signal } from '@angular/core';
import { AppMessageService } from '@core/services/app-message-service';
import { finalize } from 'rxjs/operators';
import { Company } from '../models/Company';
import { AddCompany } from '../models/AddCompany';
import { CompaniesApiService } from './companies-api.service';

@Service()
export class CompaniesFacade {
  private readonly _apiService = inject(CompaniesApiService);
  private readonly _messageService = inject(AppMessageService);

  // State Signals
  readonly companies = signal<Company[]>([]);
  readonly loading = signal<boolean>(false);
  readonly actionLoading = signal<boolean>(false);
  readonly searchTerm = signal<string>('');
  readonly selectedCompany = signal<Company | null>(null);

  // Modal Control Signals
  readonly isFormModalOpen = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly companyToDelete = signal<Company | null>(null);

  // Derived filtered companies signal
  readonly filteredCompanies = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.companies();
    if (!term) return list;
    return list.filter(
      (company) =>
        company.name.toLowerCase().includes(term) || company.phone.toLowerCase().includes(term),
    );
  });

  // Computed stats
  readonly totalCount = computed(() => this.companies().length);
  readonly totalOrders = computed(() =>
    this.companies().reduce((sum, c) => sum + (c.offerOrdersCount || 0), 0),
  );

  // === API Wrappers ===

  loadCompanies(): void {
    this.loading.set(true);
    this._apiService
      .getAllCompanie()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess && Array.isArray(res.data)) {
            this.companies.set(res.data);
          } else {
            this.companies.set([]);
            this._messageService.addErrorMessage(res?.message || 'تعذر تحميل قائمة الشركات');
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(err.error.message || 'تعذر تحميل قائمة الشركات');
        },
      });
  }

  addCompany(data: AddCompany): void {
    this.actionLoading.set(true);
    this._apiService
      .addCompany(data)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            this._messageService.addSuccessMessage(res.message || 'تمت إضافة الشركة بنجاح');
            this.loadCompanies();
            this.closeFormModal();
          } else {
            this._messageService.addErrorMessage(res?.message || 'فشل في إضافة الشركة');
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(err.error.message || 'فشل في إضافة الشركة');
        },
      });
  }

  updateCompany(id: number, data: AddCompany): void {
    this.actionLoading.set(true);
    this._apiService
      .updateCompany(id, data)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            this._messageService.addSuccessMessage(res.message || 'تم تعديل بيانات الشركة بنجاح');
            this.loadCompanies();
            this.closeFormModal();
          } else {
            this._messageService.addErrorMessage(res?.message || 'فشل في تعديل بيانات الشركة');
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(err.error.message || 'فشل في تعديل بيانات الشركة');
        },
      });
  }

  deleteCompany(id: number): void {
    this.actionLoading.set(true);
    this._apiService
      .deleteCompany(id)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            this._messageService.addSuccessMessage(res.message || 'تم حذف الشركة بنجاح');
            this.companies.update((list) => list.filter((c) => c.id !== id));
            this.closeDeleteModal();
          } else {
            this._messageService.addErrorMessage(res?.message || 'فشل في حذف الشركة');
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(err.error.message || 'فشل في حذف الشركة');
        },
      });
  }

  // === UI / Modal Handlers ===

  openCreateModal(): void {
    this.selectedCompany.set(null);
    this.isFormModalOpen.set(true);
  }

  openEditModal(company: Company): void {
    this.selectedCompany.set(company);
    this.isFormModalOpen.set(true);
  }

  closeFormModal(): void {
    this.isFormModalOpen.set(false);
    this.selectedCompany.set(null);
  }

  openDeleteModal(company: Company): void {
    this.companyToDelete.set(company);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.companyToDelete.set(null);
  }

  confirmDelete(): void {
    const company = this.companyToDelete();
    if (company) {
      this.deleteCompany(company.id);
    }
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }
}
