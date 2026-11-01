import { computed, inject, Service, signal } from '@angular/core';
import { DoctorScheduleApiService } from './doctor-schedule-api.service';
import { DoctorApiService } from '@features/doctors/services/doctor-api.service';
import { IdentityService } from '@core/services/identity-service';
import { PaginatedResult } from '@core/models/PaginatedResult';
import { DoctorSchedule } from '../models/DoctorSchedule';
import { DoctorScheduleItem } from '../models/DoctorScheduleItem';
import { Doctor } from '@features/doctors/models/Doctor';
import { DoctorScheduleCreate } from '../models/DoctorScheduleCreate';
import { DoctorScheduleUpdate } from '../models/DoctorScheduleUpdate';
import { AppMessageService } from '@core/services/app-message-service';

@Service()
export class DoctorScheduleFacade {
  private readonly _scheduleApiService = inject(DoctorScheduleApiService);
  private readonly _doctorApiService = inject(DoctorApiService);
  private readonly _identityService = inject(IdentityService);
  private readonly _toast = inject(AppMessageService);

  // State Signals
  readonly schedules = signal<DoctorSchedule[]>([]);
  readonly doctors = signal<Doctor[]>([]);
  readonly selectedDoctorId = signal<string>('');
  readonly isLoading = signal<boolean>(false);
  readonly actionLoading = signal<boolean>(false);

  // Today Schedules State Signals
  readonly todaySchedules = signal<DoctorScheduleItem[]>([]);
  readonly isLoadingTodaySchedules = signal<boolean>(false);
  readonly todaySearchQuery = signal<string>('');

  // Modal Control Signals
  readonly isFormModalOpen = signal<boolean>(false);
  readonly selectedSchedule = signal<DoctorSchedule | null>(null);
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly selectedScheduleToDelete = signal<DoctorSchedule | null>(null);

  // Filter Signals
  readonly isActiveFilter = signal<boolean | undefined>(undefined);
  readonly onlyFutureFilter = signal<boolean>(false);

  // Pagination Signals
  readonly pageNumber = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalCount = signal<number>(0);
  readonly totalPages = signal<number>(0);

  // Computed Reactive States
  readonly isDoctor = computed(() => this._identityService.isDoctor());
  readonly isAdminOrReception = computed(
    () => this._identityService.isAdmin() || this._identityService.isReception(),
  );
  readonly selectedDoctor = computed(
    () => this.doctors().find((d) => d.userId === this.selectedDoctorId()) ?? null,
  );
  readonly totalSchedulesCount = computed(() => this.totalCount() || this.schedules().length);
  readonly activeSchedulesCount = computed(() => this.schedules().filter((s) => s.isActive).length);
  readonly inactiveSchedulesCount = computed(
    () => this.schedules().filter((s) => !s.isActive).length,
  );

  // Today Schedules Computed Reactive States
  readonly filteredTodaySchedules = computed(() => {
    const query = this.todaySearchQuery().trim().toLowerCase();
    if (!query) return this.todaySchedules();
    return this.todaySchedules().filter(
      (s) =>
        s.doctorName?.toLowerCase().includes(query) || s.clinicName?.toLowerCase().includes(query),
    );
  });

  readonly todayTotalDoctorsCount = computed(() => this.todaySchedules().length);
  readonly todayActiveDoctorsCount = computed(
    () => this.todaySchedules().filter((s) => s.isActive).length,
  );
  readonly todayTotalAppointmentsCount = computed(() =>
    this.todaySchedules().reduce((acc, curr) => acc + (curr.appointmentsCount || 0), 0),
  );

  /**
   * Initializes data depending on the active user role:
   * - If Doctor: uses IdentityService.userId() as doctorId directly.
   * - If Admin/Reception: fetches active doctors via DoctorApiService.getAllDoctors(true).
   */
  async init(): Promise<void> {
    if (this.isDoctor()) {
      const docId = this._identityService.userId();
      this.selectedDoctorId.set(docId);
      if (docId) {
        this.loadSchedules(docId);
      }
    } else {
      await this.loadActiveDoctors();
    }
  }

  /**
   * Fetches active doctors for Admin and Receptionist dropdown selection.
   */
  async loadActiveDoctors(): Promise<void> {
    this.isLoading.set(true);
    this._doctorApiService.getAllDoctors(true).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.doctors.set(res.data);
          // Auto-select first doctor if non selected yet
          if (res.data.length > 0 && !this.selectedDoctorId()) {
            const firstDoctorId = res.data[0].userId;
            this.selectedDoctorId.set(firstDoctorId);
            this.loadSchedules(firstDoctorId);
          } else if (this.selectedDoctorId()) {
            this.loadSchedules(this.selectedDoctorId());
          } else {
            this.isLoading.set(false);
          }
        } else {
          this.isLoading.set(false);
          this._toast.addErrorMessage(res.message || 'فشل في جلب قائمة الأطباء');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this._toast.addErrorMessage(err.error.message || 'حدث خطأ غير متوقع عند جلب قائمة الأطباء');
      },
    });
  }

  /**
   * Selects a doctor by ID and loads their schedules.
   */
  selectDoctor(doctorId: string): void {
    if (this.selectedDoctorId() === doctorId) return;
    this.selectedDoctorId.set(doctorId);
    this.pageNumber.set(1);
    this.loadSchedules(doctorId);
  }

  /**
   * Filter Setters
   */
  setIsActiveFilter(isActive?: boolean): void {
    this.isActiveFilter.set(isActive);
    this.pageNumber.set(1);
    this.loadSchedules();
  }

  setOnlyFutureFilter(onlyFuture?: boolean): void {
    this.onlyFutureFilter.set(onlyFuture ?? false);
    this.pageNumber.set(1);
    this.loadSchedules();
  }

  resetFilters(): void {
    this.isActiveFilter.set(undefined);
    this.onlyFutureFilter.set(false);
    this.pageNumber.set(1);
    this.loadSchedules();
  }

  readonly doctorClinics = signal<
    import('@features/doctors/models/DoctorClinicsResponse').DoctorClinicsResponse[]
  >([]);

  /**
   * Loads active assigned clinics for the selected doctor
   */
  loadDoctorClinics(doctorId?: string): void {
    const targetId = doctorId ?? this.selectedDoctorId();
    if (!targetId) {
      this.doctorClinics.set([]);
      return;
    }
    this._doctorApiService.getDoctorClinicsByDoctorId(targetId).subscribe({
      next: (res) => {
        if (res.isSuccess && Array.isArray(res.data)) {
          this.doctorClinics.set(res.data.filter((c) => c.isActive));
        } else {
          this.doctorClinics.set([]);
        }
      },
      error: (err) => {
        this.doctorClinics.set([]);
        this._toast.addErrorMessage(err.error.message || 'فشل في جلب قائمة العيادات');
      },
    });
  }

  /**
   * Loads schedules for a specific doctorId with active filters and pagination.
   */
  loadSchedules(doctorId?: string): void {
    const targetId = doctorId ?? this.selectedDoctorId();
    if (!targetId) {
      this.schedules.set([]);
      this.totalCount.set(0);
      this.totalPages.set(0);
      this.isLoading.set(false);
      return;
    }

    this.loadDoctorClinics(targetId);

    const isActive = this.isActiveFilter();
    const onlyFuture = this.onlyFutureFilter();
    const pageNumber = this.pageNumber();
    const pageSize = this.pageSize();

    this.isLoading.set(true);
    this._scheduleApiService
      .getDoctorScheduleByDoctorId(targetId, pageNumber, pageSize, isActive, onlyFuture)
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res.isSuccess && res.data) {
            if ('items' in (res.data as any) && Array.isArray((res.data as any).items)) {
              const paginated = res.data as PaginatedResult<DoctorSchedule[]>;
              this.schedules.set(paginated.items);
              this.totalCount.set(paginated.totalCount ?? paginated.items.length);
              this.totalPages.set(paginated.totalPages ?? 1);
            } else if (Array.isArray(res.data)) {
              this.schedules.set(res.data);
              this.totalCount.set(res.data.length);
              this.totalPages.set(Math.ceil(res.data.length / this.pageSize()) || 1);
            } else {
              this.schedules.set([]);
              this.totalCount.set(0);
              this.totalPages.set(0);
            }
          } else {
            this.schedules.set([]);
            this.totalCount.set(0);
            this.totalPages.set(0);
            this._toast.addErrorMessage(res.message || 'فشل في جلب جدول المواعيد');
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.schedules.set([]);
          this.totalCount.set(0);
          this.totalPages.set(0);
          this._toast.addErrorMessage(err.error?.message || 'حدث خطأ أثناء جلب جدول المواعيد للطبيب');
        },
      });
  }

  /**
   * Pagination Controls
   */
  setPage(page: number): void {
    if (page < 1 || (this.totalPages() > 0 && page > this.totalPages()) || page === this.pageNumber()) return;
    this.pageNumber.set(page);
    this.loadSchedules();
  }

  setPageSize(size: number): void {
    if (size <= 0 || size === this.pageSize()) return;
    this.pageSize.set(size);
    this.pageNumber.set(1);
    this.loadSchedules();
  }

  /**
   * Form Modal Control
   */
  openCreateModal(): void {
    if (!this.selectedDoctorId()) {
      this._toast.addWarnMessage('يرجى اختيار طبيب من القائمة أولاً');
      return;
    }
    this.selectedSchedule.set(null);
    this.isFormModalOpen.set(true);
  }

  openEditModal(schedule: DoctorSchedule): void {
    this.selectedSchedule.set(schedule);
    this.isFormModalOpen.set(true);
  }

  closeFormModal(): void {
    this.isFormModalOpen.set(false);
    this.selectedSchedule.set(null);
  }

  /**
   * Creates a new doctor schedule.
   */
  createSchedule(date: string): void {
    const doctorId = this.selectedDoctorId();
    if (!doctorId) return;

    this.actionLoading.set(true);
    const request: DoctorScheduleCreate = { doctorId, date };

    this._scheduleApiService.createDoctorSchedule(request).subscribe({
      next: (res) => {
        this.actionLoading.set(false);
        if (res.isSuccess) {
          this._toast.addSuccessMessage(res.message || 'تمت إضافة الموعد المتاح بنجاح');
          this.closeFormModal();
          this.loadSchedules(doctorId);
        } else {
          this._toast.addErrorMessage(res.message || 'فشل في إضافة الموعد');
        }
      },
      error: (err) => {
        this.actionLoading.set(false);
        this._toast.addErrorMessage(err.error.message || 'حدث خطأ أثناء حفظ الموعد');
      },
    });
  }

  /**
   * Updates an existing doctor schedule.
   */
  updateSchedule(id: number, date: string): void {
    const doctorId = this.selectedDoctorId();
    if (!doctorId) return;

    this.actionLoading.set(true);
    const request: DoctorScheduleUpdate = { id, date };

    this._scheduleApiService.updateDoctorSchedule(request).subscribe({
      next: (res) => {
        this.actionLoading.set(false);
        if (res.isSuccess) {
          this._toast.addSuccessMessage(res.message || 'تم تعديل الموعد بنجاح');
          this.closeFormModal();
          this.loadSchedules(doctorId);
        } else {
          this._toast.addErrorMessage(res.message || 'فشل في تعديل الموعد');
        }
      },
      error: (err) => {
        this.actionLoading.set(false);
        this._toast.addErrorMessage(err.error.message || 'حدث خطأ أثناء تعديل الموعد');
      },
    });
  }

  /**
   * Delete Modal Control
   */
  openDeleteModal(schedule: DoctorSchedule): void {
    this.selectedScheduleToDelete.set(schedule);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.selectedScheduleToDelete.set(null);
  }

  confirmDelete(): void {
    const target = this.selectedScheduleToDelete();
    if (!target) return;

    this.actionLoading.set(true);
    this._scheduleApiService.deleteDoctorSchedule(target.id).subscribe({
      next: (res) => {
        this.actionLoading.set(false);
        if (res.isSuccess) {
          this._toast.addSuccessMessage(res.message || 'تم حذف الموعد المتاح بنجاح');
          this.closeDeleteModal();
          this.loadSchedules();
        } else {
          this._toast.addErrorMessage(res.message || 'فشل في حذف الموعد');
        }
      },
      error: (err) => {
        this.actionLoading.set(false);
        this._toast.addErrorMessage(err.error.message || 'حدث خطأ أثناء حذف الموعد');
      },
    });
  }

  /**
   * Toggle Schedule Active Status
   */
  toggleScheduleStatus(schedule: DoctorSchedule): void {
    this._scheduleApiService.toggleStatus(schedule.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this._toast.addSuccessMessage(res.message || 'تم تغيير حالة الموعد المتاح بنجاح');
          this.loadSchedules();
        } else {
          this._toast.addErrorMessage(res.message || 'فشل في تغيير حالة الموعد');
        }
      },
      error: (err) => {
        this._toast.addErrorMessage(err.error.message || 'حدث خطأ أثناء تغيير حالة الموعد');
      },
    });
  }

  /**
   * Fetches today's doctor schedules via DoctorScheduleApiService.getTodaySchedules()
   */
  loadTodaySchedules(): void {
    this.isLoadingTodaySchedules.set(true);
    this._scheduleApiService.getTodaySchedules().subscribe({
      next: (res) => {
        this.isLoadingTodaySchedules.set(false);
        if (res.isSuccess && res.data) {
          this.todaySchedules.set(res.data);
        } else {
          this.todaySchedules.set([]);
          this._toast.addErrorMessage(res.message || 'فشل في جلب قائمة مواعيد اليوم للأطباء');
        }
      },
      error: (err) => {
        this.isLoadingTodaySchedules.set(false);
        this.todaySchedules.set([]);
        this._toast.addErrorMessage(err.error.message || 'حدث خطأ أثناء جلب مواعيد اليوم للأطباء');
      },
    });
  }

  setTodaySearchQuery(query: string): void {
    this.todaySearchQuery.set(query);
  }
}
