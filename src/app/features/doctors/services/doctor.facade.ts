import { computed, inject, Service, signal } from '@angular/core';
import { AppMessageService } from '@core/services/app-message-service';
import { finalize } from 'rxjs/operators';
import { Doctor } from '../models/Doctor';
import { UpdateDoctorRequest } from '../models/UpdateDoctorRequest';
import { DoctorApiService } from './doctor-api.service';
import { AuthApiService } from '../../auth/services/auth-api.service';
import { ClinicApiService } from '../../clinics/services/clinic-api.service';
import { Clinic } from '../../clinics/models/Clinic';
import { RegisterDoctorRequest } from '../../auth/models/RegisterDoctorRequest';

@Service()
export class DoctorFacade {
  private _doctorApiService = inject(DoctorApiService);
  private _authApiService = inject(AuthApiService);
  private _clinicApiService = inject(ClinicApiService);
  private _messageService = inject(AppMessageService);

  // State Signals
  readonly doctors = signal<Doctor[]>([]);
  readonly clinics = signal<Clinic[]>([]);
  readonly loading = signal<boolean>(false);
  readonly actionLoading = signal<boolean>(false);
  readonly searchTerm = signal<string>('');
  readonly activeFilter = signal<boolean | null>(null);
  readonly selectedDoctor = signal<Doctor | null>(null);

  // Modal State Signals
  readonly isFormModalOpen = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly doctorToDelete = signal<Doctor | null>(null);

  // Computed Derived Signals
  readonly filteredDoctors = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.activeFilter();
    let list = this.doctors();

    if (status !== null) {
      list = list.filter((d) => d.isActive === status);
    }

    if (!term) return list;

    return list.filter(
      (doc) =>
        doc.fullName.toLowerCase().includes(term) || doc.username.toLowerCase().includes(term),
    );
  });

  readonly totalCount = computed(() => this.doctors().length);
  readonly activeCount = computed(() => this.doctors().filter((d) => d.isActive).length);
  readonly inactiveCount = computed(() => this.doctors().filter((d) => !d.isActive).length);

  /**
   * 1. API Wrap: DoctorApiService.getAllDoctors
   */
  loadDoctors(isActive: boolean | null = null): void {
    this.loading.set(true);
    // Fetch both active and inactive doctors by passing true/false or combining results if needed
    this._doctorApiService
      .getAllDoctors(isActive ?? undefined)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess && Array.isArray(res.data)) {
            this.doctors.set(res.data);
          } else {
            const fallbackData = Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res)
                ? (res as unknown as Doctor[])
                : [];
            this.doctors.set(fallbackData);
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(err.error.message || 'تعذر تحميل قائمة الأطباء');
        },
      });
  }

  /**
   * Helper: Load clinics for dropdown selection when creating/editing doctor
   */
  loadClinics(): void {
    this._clinicApiService.getClinics().subscribe({
      next: (res) => {
        if (res?.isSuccess && Array.isArray(res.data)) {
          this.clinics.set(res.data);
        }
      },
    });
  }

  /**
   * 2. API Wrap: DoctorApiService.getDoctorById
   */
  getDoctorById(id: string): void {
    this.loading.set(true);
    this._doctorApiService
      .getDoctorById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess && res.data) {
            this.selectedDoctor.set(res.data);
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(err.error.message || 'تعذر تحميل بيانات الطبيب');
        },
      });
  }

  /**
   * 3. API Wrap: AuthApiService.RegisterDoctor
   */
  registerDoctor(request: RegisterDoctorRequest): void {
    this.actionLoading.set(true);
    this._authApiService
      .RegisterDoctor(request)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            this._messageService.addSuccessMessage('تم تسجيل حساب الطبيب بنجاح');
            this.closeFormModal();
            this.loadDoctors();
          } else {
            this._messageService.addErrorMessage(res?.message || 'حدث خطأ أثناء تسجيل حساب الطبيب');
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(err.error.message || 'فشلت عملية إضافة الطبيب');
        },
      });
  }

  /**
   * 4. API Wrap: DoctorApiService.updateDoctor
   */
  updateDoctor(request: UpdateDoctorRequest): void {
    this.actionLoading.set(true);
    this._doctorApiService
      .updateDoctor(request)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            this._messageService.addSuccessMessage(res?.message || 'تم تحديث بيانات الطبيب بنجاح');
            this.closeFormModal();
            this.loadDoctors();
          } else {
            this._messageService.addErrorMessage(
              res?.message || 'حدث خطأ أثناء تعديل بيانات الطبيب',
            );
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(
            err.error.message || 'فشلت عملية تعديل بيانات الطبيب',
          );
        },
      });
  }

  /**
   * 5. API Wrap: DoctorApiService.deleteDoctorByUserId
   */
  deleteDoctor(userId: string): void {
    this.actionLoading.set(true);
    this._doctorApiService
      .deleteDoctorByUserId(userId)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            this._messageService.addSuccessMessage(res?.message || 'تم حذف حساب الطبيب بنجاح');
            this.closeDeleteModal();
            this.loadDoctors();
          } else {
            this._messageService.addErrorMessage(
              res?.message || 'حدث خطأ أثناء تنفيذ عملية حذف الطبيب',
            );
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(err.error.message || 'فشلت عملية حذف الطبيب');
        },
      });
  }

  /**
   * 6. API Wrap: DoctorApiService.toggleStatus
   */
  toggleDoctorStatus(userId: string): void {
    this.actionLoading.set(true);
    this._doctorApiService
      .toggleStatus(userId)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            this._messageService.addSuccessMessage(res?.message || 'تم تغيير حالة الطبيب بنجاح');
            this.loadDoctors();
          } else {
            this._messageService.addErrorMessage(res?.message || 'حدث خطأ أثناء تغيير حالة الطبيب');
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(err.error.message || 'فشل تغيير حالة الطبيب');
        },
      });
  }

  // --- UI & Modal Handlers ---

  openCreateModal(): void {
    this.selectedDoctor.set(null);
    this.isFormModalOpen.set(true);
  }

  openEditModal(doctor: Doctor): void {
    this.selectedDoctor.set(doctor);
    this.isFormModalOpen.set(true);
  }

  closeFormModal(): void {
    this.isFormModalOpen.set(false);
    this.selectedDoctor.set(null);
  }

  openDeleteModal(doctor: Doctor): void {
    this.doctorToDelete.set(doctor);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.doctorToDelete.set(null);
  }

  confirmDelete(): void {
    const doctor = this.doctorToDelete();
    if (doctor) {
      this.deleteDoctor(doctor.userId);
    }
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  setActiveFilter(filter: boolean | null): void {
    this.activeFilter.set(filter);
  }
}
