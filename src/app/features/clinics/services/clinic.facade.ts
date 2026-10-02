import { computed, inject, Service, signal } from '@angular/core';
import { AppMessageService } from '@core/services/app-message-service';
import { finalize } from 'rxjs/operators';
import { Clinic } from '../models/Clinic';
import { ClinicApiService } from './clinic-api.service';
import { CreateClinicResponse } from '../models/CreateClinicRequest';
import { CreateClinicRequest } from '../models/CreateClinicRequest.1';

@Service()
export class ClinicFacade {
  private _apiService = inject(ClinicApiService);
  private _messageService = inject(AppMessageService);

  // State Signals
  readonly clinics = signal<Clinic[]>([]);
  readonly loading = signal<boolean>(false);
  readonly actionLoading = signal<boolean>(false);
  readonly searchTerm = signal<string>('');
  readonly selectedClinic = signal<Clinic | null>(null);

  // Modal Control Signals
  readonly isFormModalOpen = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly clinicToDelete = signal<Clinic | null>(null);

  // Selection state for multi-select operations
  readonly selectedClinicIds = signal<Set<number | string>>(new Set());

  // Derived filtered clinics signal
  readonly filteredClinics = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.clinics();
    if (!term) return list;
    return list.filter((clinic) => clinic.name.toLowerCase().includes(term));
  });

  // Derived metrics
  // readonly filteredCount = computed(() => this.filteredClinics().length);
  // readonly selectedCount = computed(() => this.selectedClinicIds().size);

  /**
   * 1. API Wrap: getClinics
   */
  loadClinics(): void {
    this.loading.set(true);
    this._apiService
      .getClinics()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess && Array.isArray(res.data)) {
            this.clinics.set(res.data);
          } else {
            const fallbackData = Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res)
                ? (res as unknown as Clinic[])
                : [];
            this.clinics.set(fallbackData);
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(err.error.message || 'تعذر تحميل قائمة العيادات');
        },
      });
  }

  /**
   * 2. API Wrap: getClinicById
   */
  getClinicById(id: number): void {
    this.loading.set(true);
    this._apiService
      .getClinicById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess && res.data) {
            this.selectedClinic.set(res.data);
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(
            err.error.message || 'تعذر تحميل بيانات العيادة المطلوب عرضها',
          );
        },
      });
  }

  /**
   * 3. API Wrap: createClinic
   */
  createClinic(name: string): void {
    if (!name || !name.trim()) return;

    this.actionLoading.set(true);
    const request: CreateClinicRequest = { name: name.trim() };

    this._apiService
      .createClinic(request)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            this._messageService.addSuccessMessage(res?.message || 'تمت إضافة العيادة بنجاح');
            this.closeFormModal();
            this.loadClinics();
          } else {
            this._messageService.addErrorMessage(
              res?.message || 'حدث خطأ أثناء حفظ بيانات العيادة',
            );
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(err.error.message || 'فشلت عملية إضافة العيادة');
        },
      });
  }

  /**
   * 4. API Wrap: updateClinic
   */
  updateClinic(id: number | string, name: string): void {
    if (!name || !name.trim()) return;

    this.actionLoading.set(true);
    const numId = Number(id);
    const request: CreateClinicRequest = { name: name.trim() };

    this._apiService
      .updateClinic(numId, request)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            this._messageService.addSuccessMessage(res?.message || 'تم تعديل بيانات العيادة بنجاح');
            this.closeFormModal();
            this.loadClinics();
          } else {
            this._messageService.addErrorMessage(
              res?.message || 'حدث خطأ أثناء تعديل بيانات العيادة',
            );
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(err.error.message || 'فشلت عملية تعديل العيادة');
        },
      });
  }

  /**
   * 5. API Wrap: deleteClinic
   */
  deleteClinic(id: number | string): void {
    this.actionLoading.set(true);
    const numId = Number(id);

    this._apiService
      .deleteClinic(numId)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            this._messageService.addSuccessMessage(res?.message || 'تم حذف العيادة بنجاح');
            this.closeDeleteModal();
            this.loadClinics();
          } else {
            this._messageService.addErrorMessage(res?.message || 'حدث خطأ أثناء تنفيذ عملية الحذف');
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(err.error.message || 'فشلت عملية حذف العيادة');
        },
      });
  }

  // --- Modal & UI Handlers ---

  openCreateModal(): void {
    this.selectedClinic.set(null);
    this.isFormModalOpen.set(true);
  }

  openEditModal(clinic: Clinic): void {
    this.selectedClinic.set(clinic);
    this.isFormModalOpen.set(true);
  }

  closeFormModal(): void {
    this.isFormModalOpen.set(false);
    this.selectedClinic.set(null);
  }

  openDeleteModal(clinic: Clinic): void {
    this.clinicToDelete.set(clinic);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.clinicToDelete.set(null);
  }

  confirmDelete(): void {
    const clinic = this.clinicToDelete();
    if (clinic) {
      this.deleteClinic(clinic.id);
    }
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  toggleSelectClinic(id: number | string): void {
    this.selectedClinicIds.update((set) => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  selectAllClinics(): void {
    const allIds = this.filteredClinics().map((c) => c.id);
    this.selectedClinicIds.set(new Set(allIds));
  }

  clearSelection(): void {
    this.selectedClinicIds.set(new Set());
  }
}
