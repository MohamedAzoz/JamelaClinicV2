import { computed, inject, Service, signal } from '@angular/core';
import { DoctorScheduleApiService } from './doctor-schedule-api.service';
import { DoctorApiService } from '@features/doctors/services/doctor-api.service';
import { IdentityService } from '@core/services/identity-service';
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
  readonly onlyFutureFilter = signal<boolean | undefined>(undefined);

  // Computed Reactive States
  readonly isDoctor = computed(() => this._identityService.isDoctor());
  readonly isAdminOrReception = computed(
    () => this._identityService.isAdmin() || this._identityService.isReception(),
  );
  readonly selectedDoctor = computed(
    () => this.doctors().find((d) => d.userId === this.selectedDoctorId()) ?? null,
  );
  readonly totalSchedulesCount = computed(() => this.schedules().length);
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
        s.doctorName?.toLowerCase().includes(query) ||
        s.clinicName?.toLowerCase().includes(query),
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
      error: () => {
        this.isLoading.set(false);
        this._toast.addErrorMessage('حدث خطأ غير متوقع عند جلب قائمة الأطباء');
      },
    });
  }

  /**
   * Selects a doctor by ID and loads their schedules.
   */
  selectDoctor(doctorId: string): void {
    if (this.selectedDoctorId() === doctorId) return;
    this.selectedDoctorId.set(doctorId);
    this.loadSchedules(doctorId);
  }

  /**
   * Filter Setters
   */
  setIsActiveFilter(isActive?: boolean): void {
    this.isActiveFilter.set(isActive);
    this.loadSchedules();
  }

  setOnlyFutureFilter(onlyFuture?: boolean): void {
    this.onlyFutureFilter.set(onlyFuture);
    this.loadSchedules();
  }

  resetFilters(): void {
    this.isActiveFilter.set(undefined);
    this.onlyFutureFilter.set(undefined);
    this.loadSchedules();
  }

  /**
   * Loads schedules for a specific doctorId with active filters.
   */
  loadSchedules(doctorId?: string): void {
    const targetId = doctorId ?? this.selectedDoctorId();
    if (!targetId) {
      this.schedules.set([]);
      this.isLoading.set(false);
      return;
    }

    const isActive = this.isActiveFilter();
    const onlyFuture = this.onlyFutureFilter();

    this.isLoading.set(true);
    this._scheduleApiService.getDoctorScheduleByDoctorId(targetId, isActive, onlyFuture).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.isSuccess && res.data) {
          this.schedules.set(res.data);
        } else {
          this.schedules.set([]);
          this._toast.addErrorMessage(res.message || 'فشل في جلب جدول المواعيد');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.schedules.set([]);
        this._toast.addErrorMessage('حدث خطأ أثناء جلب جدول المواعيد للطبيب');
      },
    });
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
      error: () => {
        this.actionLoading.set(false);
        this._toast.addErrorMessage('حدث خطأ أثناء حفظ الموعد');
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
    const request: DoctorScheduleUpdate = { id, date, doctorId };

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
      error: () => {
        this.actionLoading.set(false);
        this._toast.addErrorMessage('حدث خطأ أثناء تعديل الموعد');
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
      error: () => {
        this.actionLoading.set(false);
        this._toast.addErrorMessage('حدث خطأ أثناء حذف الموعد');
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
      error: () => {
        this._toast.addErrorMessage('حدث خطأ أثناء تغيير حالة الموعد');
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
      error: () => {
        this.isLoadingTodaySchedules.set(false);
        this.todaySchedules.set([]);
        this._toast.addErrorMessage('حدث خطأ أثناء جلب مواعيد اليوم للأطباء');
      },
    });
  }

  setTodaySearchQuery(query: string): void {
    this.todaySearchQuery.set(query);
  }
}
