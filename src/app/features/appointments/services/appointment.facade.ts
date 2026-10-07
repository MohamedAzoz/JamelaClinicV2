import { computed, inject, Service, signal } from '@angular/core';
import { DoctorApiService } from '@features/doctors/services/doctor-api.service';
import { EmployeeApiService } from '@features/employees/services/employee-api.service';
import { DoctorScheduleApiService } from '@features/doctorSchedules/services/doctor-schedule-api.service';
import { AppointmentApiService } from './appointment-api.service';
import { Doctor } from '@features/doctors/models/Doctor';
import { Employee } from '@features/employees/models/Employee';
import { DoctorSchedule } from '@features/doctorSchedules/models/DoctorSchedule';
import { Appointments } from '../models/Appointments';
import { FilterAppointment } from '../models/FilterAppointment';
import { FilterAppointments } from '../models/FilterAppointments';
import { CreateAppointments } from '../models/CreateAppointments';
import { AppointmentUpdate } from '../models/AppointmentUpdate';
import { Period } from '../models/Period';
import { AppointmentStatus } from '../models/AppointmentStatus';
import { AppointmentsStatistics } from '../models/AppointmentsStatistics';
import { AppointmentsMaterial } from '../models/AppointmentsMaterial';
import { UpdateAppointmentMaterial } from '../models/UpdateAppointmentMaterial';
import { TodayAppointment } from '../models/TodayAppointment';
import { AppMessageService } from '@core/services/app-message-service';
import { IdentityService } from '@core/services/identity-service';
import { DoctorClinicsResponse } from '@features/doctors/models/DoctorClinicsResponse';

@Service()
export class AppointmentFacade {
  private readonly _doctorApiService = inject(DoctorApiService);
  private readonly _employeeApiService = inject(EmployeeApiService);
  private readonly _identityService = inject(IdentityService);
  private readonly _scheduleApiService = inject(DoctorScheduleApiService);
  private readonly _appointmentApiService = inject(AppointmentApiService);
  private readonly _toast = inject(AppMessageService);

  // ==========================================
  // Doctor & Schedule Selection State (Booking)
  // ==========================================
  readonly doctors = signal<Doctor[]>([]);
  readonly doctorClinics = signal<DoctorClinicsResponse[]>([]);
  readonly selectedDoctorId = signal<string>('');
  readonly selectedClinicId = signal<number | null>(null);
  readonly schedules = signal<DoctorSchedule[]>([]);

  readonly isLoadingDoctors = signal<boolean>(false);
  readonly isLoadingDoctorClinics = signal<boolean>(false);
  readonly isLoadingSchedules = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly bookingSuccess = signal<boolean>(false);
  readonly lastBookedAppointment = signal<CreateAppointments | null>(null);

  // ==========================================
  // Employees State for Filters
  // ==========================================
  readonly employees = signal<Employee[]>([]);
  readonly isLoadingEmployees = signal<boolean>(false);

  // ==========================================
  // Statistics State
  // ==========================================
  readonly statistics = signal<AppointmentsStatistics | null>(null);
  readonly isLoadingStatistics = signal<boolean>(false);

  // ==========================================
  // Appointments Management & List State
  // ==========================================
  readonly appointments = signal<Appointments[]>([]);
  readonly totalCount = signal<number>(0);
  readonly pageNumber = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalPages = signal<number>(1);

  readonly isLoadingAppointments = signal<boolean>(false);
  readonly isExportingExcel = signal<boolean>(false);
  readonly isUpdating = signal<boolean>(false);

  // Filter Signals
  readonly periodFilter = signal<Period | null>(null);
  readonly fromDateFilter = signal<string>('');
  readonly toDateFilter = signal<string>('');
  readonly doctorIdFilter = signal<string>('');
  readonly employeeIdFilter = signal<string>('');
  readonly clinicIdFilter = signal<number | undefined>(undefined);
  readonly doctorScheduleIdFilter = signal<number | undefined>(undefined);
  readonly statusFilter = signal<AppointmentStatus | null>(null);

  setClinicIdFilter(clinicId?: number): void {
    this.clinicIdFilter.set(clinicId);
    this.pageNumber.set(1);
    this.refreshData();
  }

  setDoctorScheduleIdFilter(scheduleId?: number): void {
    this.doctorScheduleIdFilter.set(scheduleId);
    this.pageNumber.set(1);
    this.refreshData();
  }

  // ==========================================
  // Schedule Specific Appointments State
  // ==========================================
  readonly scheduleAppointments = signal<Appointments[]>([]);
  readonly isLoadingScheduleAppointments = signal<boolean>(false);
  readonly currentScheduleId = signal<number | null>(null);
  readonly actionLoadingId = signal<number | null>(null);

  readonly appointmentDetails = signal<AppointmentsMaterial | null>(null);
  readonly isLoadingAppointmentDetails = signal<boolean>(false);
  readonly isUpdatingMaterials = signal<boolean>(false);
  readonly isClearingMaterials = signal<boolean>(false);

  // Doctor Today Appointments Summary State
  readonly todayAppointments = signal<TodayAppointment[]>([]);
  readonly isLoadingTodayAppointments = signal<boolean>(false);

  // Computed metrics for schedule appointments
  readonly scheduleTotalCount = computed(() => this.scheduleAppointments().length);
  readonly scheduleTotalFeeSum = computed(() =>
    this.scheduleAppointments().reduce((acc, curr) => acc + (curr.consultationFee || 0), 0),
  );
  readonly scheduleDoctorEarningsSum = computed(() =>
    this.scheduleAppointments().reduce((acc, curr) => acc + (curr.doctorEarnings || 0), 0),
  );
  readonly scheduleCenterEarningsSum = computed(() =>
    this.scheduleAppointments().reduce((acc, curr) => acc + (curr.centerEarnings || 0), 0),
  );
  readonly scheduleCompletedCount = computed(
    () => this.scheduleAppointments().filter((a) => Number(a.status) === 3).length,
  );
  readonly scheduleInProgressCount = computed(
    () => this.scheduleAppointments().filter((a) => Number(a.status) === 2).length,
  );
  readonly scheduleUnpaidCount = computed(
    () => this.scheduleAppointments().filter((a) => Number(a.status) === 1).length,
  );
  readonly scheduleCancelledCount = computed(
    () => this.scheduleAppointments().filter((a) => Number(a.status) === 4).length,
  );

  // Computed metrics for Doctor Today Appointments Summary
  readonly todayTotalCount = computed(() => this.todayAppointments().length);
  readonly todayCompletedCount = computed(
    () => this.todayAppointments().filter((a) => Number(a.status) === 3).length,
  );
  readonly todayInProgressCount = computed(
    () => this.todayAppointments().filter((a) => Number(a.status) === 2).length,
  );
  readonly todayUnpaidCount = computed(
    () => this.todayAppointments().filter((a) => Number(a.status) === 1).length,
  );
  readonly todayCancelledCount = computed(
    () => this.todayAppointments().filter((a) => Number(a.status) === 4).length,
  );

  // ==========================================
  // Computed Reactive States
  // ==========================================
  readonly selectedDoctor = computed(
    () => this.doctors().find((d) => d.userId === this.selectedDoctorId()) ?? null,
  );
  readonly clinics = computed(() => this.doctorClinics());
  readonly selectedClinic = computed(
    () => this.doctorClinics().find((c) => c.id === this.selectedClinicId()) ?? null,
  );

  readonly isAdminOrAccountant = computed(
    () => this._identityService.isAdmin() || this._identityService.isAccountant(),
  );
  readonly isAdmin = computed(() => this._identityService.isAdmin());

  readonly isDoctorOrAdmin = computed(
    () => this._identityService.isDoctor() || this._identityService.isAdmin(),
  );
  readonly isDoctorOrAdminOrAccountant = computed(
    () =>
      this._identityService.isDoctor() ||
      this._identityService.isAdmin() ||
      this._identityService.isAccountant(),
  );
  readonly isDoctor = computed(() => this._identityService.isDoctor());
  readonly isReception = computed(() => this._identityService.isReception());

  readonly hasAvailableSchedules = computed(() => this.schedules().length > 0);

  /**
   * Filtered appointments applying search, doctor, visit type, status, and payment filters locally.
   */
  readonly filteredAppointments = computed(() => {
    let list = this.appointments();
    return list;
  });

  // ==========================================
  // Booking Form Actions & API Wrappers
  // ==========================================
  async initBooking(): Promise<void> {
    await this.loadActiveDoctors();
  }

  async loadActiveDoctors(): Promise<void> {
    this.isLoadingDoctors.set(true);
    this._doctorApiService.getAllDoctors(true).subscribe({
      next: (res) => {
        this.isLoadingDoctors.set(false);
        if (res.isSuccess && res.data) {
          this.doctors.set(res.data);
        } else {
          this.doctors.set([]);
          this._toast.addErrorMessage(res.message || 'فشل في جلب قائمة الأطباء المتاحين');
        }
      },
      error: (err) => {
        this.isLoadingDoctors.set(false);
        this.doctors.set([]);
        this._toast.addErrorMessage(
          err.error.message || 'حدث خطأ أثناء الاتصال بالخادم لجلب الأطباء',
        );
      },
    });
  }

  async loadActiveEmployees(): Promise<void> {
    this.isLoadingEmployees.set(true);
    this._employeeApiService.getAllEmployees(true).subscribe({
      next: (res) => {
        this.isLoadingEmployees.set(false);
        if (res.isSuccess && res.data) {
          this.employees.set(res.data);
        } else {
          this.employees.set([]);
        }
      },
      error: (err) => {
        this.isLoadingEmployees.set(false);
        this.employees.set([]);
        this._toast.addErrorMessage(
          err.error.message || 'حدث خطأ أثناء الاتصال بالخادم لجلب الموظفين',
        );
      },
    });
  }

  selectDoctor(doctorId: string): void {
    this.selectedDoctorId.set(doctorId);
    this.selectedClinicId.set(null);
    this.schedules.set([]);
    this.doctorClinics.set([]);
    if (!doctorId) return;

    this.loadDoctorSchedules(doctorId);
    this.loadDoctorClinics(doctorId);
  }

  loadDoctorClinics(doctorId: string): void {
    this.isLoadingDoctorClinics.set(true);
    this._doctorApiService.getDoctorClinicsByDoctorId(doctorId).subscribe({
      next: (res) => {
        this.isLoadingDoctorClinics.set(false);
        if (res.isSuccess && res.data) {
          this.doctorClinics.set(res.data);
          if (res.data.length > 0) {
            this.selectedClinicId.set(res.data[0].id);
          }
        } else {
          this.doctorClinics.set([]);
        }
      },
      error: (err) => {
        this.isLoadingDoctorClinics.set(false);
        this.doctorClinics.set([]);
      },
    });
  }

  loadDoctorSchedules(doctorId: string): void {
    this.isLoadingSchedules.set(true);
    this._scheduleApiService.getDoctorScheduleByDoctorId(doctorId, true, true).subscribe({
      next: (res) => {
        this.isLoadingSchedules.set(false);
        if (res.isSuccess && res.data) {
          this.schedules.set(res.data);
        } else {
          this.schedules.set([]);
          this._toast.addErrorMessage(res.message || 'لا توجد مواعيد متاحة لهذا الطبيب');
        }
      },
      error: (err) => {
        this.isLoadingSchedules.set(false);
        this.schedules.set([]);
        this._toast.addErrorMessage(
          err.error.message || 'حدث خطأ أثناء الاتصال بالخادم لجلب مواعيد الطبيب',
        );
      },
    });
  }

  async createAppointment(data: CreateAppointments): Promise<boolean> {
    this.isSubmitting.set(true);

    return new Promise<boolean>((resolve) => {
      this._appointmentApiService.createAppointments(data).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          if (res.isSuccess) {
            this._toast.addSuccessMessage(res.message || 'تم حجز الموعد للمريض بنجاح');
            this.lastBookedAppointment.set(data);
            this.bookingSuccess.set(true);
            resolve(true);
          } else {
            this._toast.addErrorMessage(res.message || 'فشل في إضافة بيانات الحجز');
            resolve(false);
          }
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this._toast.addErrorMessage(
            err.error.message || 'حدث خطأ غير متوقع عند إجراء عملية الحجز',
          );
          resolve(false);
        },
      });
    });
  }

  resetBookingState(): void {
    this.bookingSuccess.set(false);
    this.lastBookedAppointment.set(null);
  }

  async updateAppointment(appointment: AppointmentUpdate): Promise<boolean> {
    this.isUpdating.set(true);

    return new Promise<boolean>((resolve) => {
      this._appointmentApiService.updateAppointment(appointment).subscribe({
        next: (res) => {
          this.isUpdating.set(false);
          if (res.isSuccess) {
            this._toast.addSuccessMessage(res.message || 'تم تعديل بيانات الحجز بنجاح');
            const currSchedId = this.currentScheduleId();
            if (currSchedId) {
              this.loadAppointmentsByScheduleId(currSchedId);
            } else {
              this.refreshData();
            }
            resolve(true);
          } else {
            this._toast.addErrorMessage(res.message || 'فشل في تعديل بيانات الحجز');
            resolve(false);
          }
        },
        error: (err) => {
          this.isUpdating.set(false);
          this._toast.addErrorMessage(err.error.message || 'حدث خطأ غير متوقع أثناء تعديل الحجز');
          resolve(false);
        },
      });
    });
  }

  // ==========================================
  // Appointments Management & Listing Actions
  // ==========================================
  async initAppointmentsManagement(): Promise<void> {
    await Promise.all([this.loadActiveDoctors(), this.loadActiveEmployees()]);
    this.refreshData();
  }

  refreshData(): void {
    this.loadAppointments();
    this.loadStatistics();
  }

  /**
   * Fetches statistics via AppointmentApiService.getStatistics(filter)
   */
  async loadStatistics(): Promise<void> {
    this.isLoadingStatistics.set(true);

    const filter: FilterAppointments = {
      Period: this.periodFilter() || null,
      FromDate: this.fromDateFilter() ? this.fromDateFilter() : undefined,
      ToDate: this.toDateFilter() ? this.toDateFilter() : undefined,
      DoctorId: this.doctorIdFilter() ? this.doctorIdFilter() : undefined,
      EmployeeId: this.employeeIdFilter() ? this.employeeIdFilter() : undefined,
      ClinicId: this.clinicIdFilter(),
      Status: this.statusFilter(),
    };

    this._appointmentApiService.getStatistics(filter).subscribe({
      next: (res) => {
        this.isLoadingStatistics.set(false);
        if (res.isSuccess && res.data) {
          this.statistics.set(res.data);
        } else {
          this.statistics.set(null);
        }
      },
      error: (err) => {
        this.isLoadingStatistics.set(false);
        this.statistics.set(null);
        this._toast.addErrorMessage(err.error.message || 'حدث خطأ غير متوقع أثناء جلب الإحصائيات');
      },
    });
  }

  /**
   * Fetches all appointments via AppointmentApiService.getAllAppointments(filter)
   */
  async loadAppointments(): Promise<void> {
    this.isLoadingAppointments.set(true);

    const filter: FilterAppointment = {
      Period: this.periodFilter() || null,
      FromDate: this.fromDateFilter() ? this.fromDateFilter() : undefined,
      ToDate: this.toDateFilter() ? this.toDateFilter() : undefined,
      DoctorId: this.doctorIdFilter() ? this.doctorIdFilter() : undefined,
      EmployeeId: this.employeeIdFilter() ? this.employeeIdFilter() : undefined,
      ClinicId: this.clinicIdFilter(),
      DoctorScheduleId: this.doctorScheduleIdFilter(),
      PageNumber: this.pageNumber(),
      PageSize: this.pageSize(),
    };

    this._appointmentApiService.getAllAppointments(filter).subscribe({
      next: (res) => {
        this.isLoadingAppointments.set(false);
        if (res.isSuccess && res.data) {
          const paginated = res.data;
          this.appointments.set(paginated.items || []);
          this.totalCount.set(
            paginated.totalCount || (paginated.items ? paginated.items.length : 0),
          );
          this.totalPages.set(paginated.totalPages || 1);
        } else {
          this.appointments.set([]);
          this.totalCount.set(0);
          this.totalPages.set(1);
          this._toast.addErrorMessage(res.message || 'فشل في جلب قائمة الحجوزات');
        }
      },
      error: (err) => {
        this.isLoadingAppointments.set(false);
        this.appointments.set([]);
        this.totalCount.set(0);
        this.totalPages.set(1);
        this._toast.addErrorMessage(err.error.message || 'حدث خطأ أثناء تحميل سجل الحجوزات');
      },
    });
  }

  /**
   * Exports appointments report via AppointmentApiService.getExportAppointments(filter)
   */
  exportAppointmentsExcel(): void {
    this.isExportingExcel.set(true);

    const filter: FilterAppointment = {
      Period: this.periodFilter() || null,
      FromDate: this.fromDateFilter() ? this.fromDateFilter() : undefined,
      ToDate: this.toDateFilter() ? this.toDateFilter() : undefined,
      DoctorId: this.doctorIdFilter() ? this.doctorIdFilter() : undefined,
      EmployeeId: this.employeeIdFilter() ? this.employeeIdFilter() : undefined,
      ClinicId: this.clinicIdFilter(),
      DoctorScheduleId: this.doctorScheduleIdFilter(),
      PageNumber: this.pageNumber(),
      PageSize: this.pageSize(),
    };

    this._appointmentApiService.getExportAppointments(filter).subscribe({
      next: (blob) => {
        this.isExportingExcel.set(false);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `تقرير_الحجوزات_${new Date().toISOString().slice(0, 10)}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this._toast.addSuccessMessage('تم تصدير تقرير الحجوزات بنجاح');
      },
      error: (err) => {
        this.isExportingExcel.set(false);
        this._toast.addErrorMessage(err.error.message || 'حدث خطأ أثناء تصدير ملف الاكسل');
      },
    });
  }

  // ==========================================
  // Filter Handlers
  // ==========================================
  setPeriodFilter(period: Period | null): void {
    this.periodFilter.set(period);
    if (period !== null) {
      this.fromDateFilter.set('');
      this.toDateFilter.set('');
    }
    this.pageNumber.set(1);
    this.refreshData();
  }

  setDateRangeFilter(fromDate: string, toDate: string): void {
    this.fromDateFilter.set(fromDate);
    this.toDateFilter.set(toDate);
    if (fromDate || toDate) {
      this.periodFilter.set(null);
    }
    this.pageNumber.set(1);
    this.refreshData();
  }

  setDoctorIdFilter(doctorId: string): void {
    this.doctorIdFilter.set(doctorId);
    this.pageNumber.set(1);
    this.refreshData();
  }

  setEmployeeIdFilter(employeeId: string): void {
    this.employeeIdFilter.set(employeeId);
    this.pageNumber.set(1);
    this.refreshData();
  }

  setStatusFilter(status: AppointmentStatus | null): void {
    this.statusFilter.set(status);
    this.pageNumber.set(1);
    this.refreshData();
  }

  setPageNumber(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.pageNumber.set(page);
    this.loadAppointments();
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.pageNumber.set(1);
    this.loadAppointments();
  }

  resetAllFilters(): void {
    this.periodFilter.set(null);
    this.fromDateFilter.set('');
    this.toDateFilter.set('');
    this.doctorIdFilter.set('');
    this.employeeIdFilter.set('');
    this.clinicIdFilter.set(undefined);
    this.doctorScheduleIdFilter.set(undefined);
    this.statusFilter.set(null);
    this.pageNumber.set(1);
    this.refreshData();
  }

  // ==========================================
  // Schedule Specific Appointments Actions
  // ==========================================

  /**
   * Fetch appointment details with materials using AppointmentApiService.getAppointmentDetailsWithMaterials.
   */
  loadAppointmentDetails(appointmentId: number): void {
    this.isLoadingAppointmentDetails.set(true);

    this._appointmentApiService.getAppointmentDetailsWithMaterials(appointmentId).subscribe({
      next: (res) => {
        this.isLoadingAppointmentDetails.set(false);
        if (res.isSuccess && res.data) {
          this.appointmentDetails.set(res.data);
        } else {
          this.appointmentDetails.set(null);
          this._toast.addErrorMessage(res.message || 'فشل في جلب تفاصيل الحجز');
        }
      },
      error: (err) => {
        this.isLoadingAppointmentDetails.set(false);
        this.appointmentDetails.set(null);
        this._toast.addErrorMessage(err.error.message || 'حدث خطأ أثناء تحميل تفاصيل الحجز');
      },
    });
  }

  clearAppointmentDetails(): void {
    this.appointmentDetails.set(null);
    this.isLoadingAppointmentDetails.set(false);
  }

  updateMaterials(data: UpdateAppointmentMaterial): void {
    this.isUpdatingMaterials.set(true);
    this._appointmentApiService.updateMaterials(data).subscribe({
      next: (res) => {
        this.isUpdatingMaterials.set(false);
        if (res.isSuccess) {
          this._toast.addSuccessMessage(res.message || 'تم تحديث المستلزمات بنجاح');
          this.loadAppointmentDetails(data.appointmentId);
        } else {
          this._toast.addErrorMessage(res.message || 'فشل في تحديث المستلزمات');
        }
      },
      error: (err) => {
        this.isUpdatingMaterials.set(false);
        this._toast.addErrorMessage(err.error.message || 'حدث خطأ أثناء تحديث المستلزمات');
      },
    });
  }

  clearMaterials(appointmentId: number): void {
    this.isClearingMaterials.set(true);
    this._appointmentApiService.clearMaterials(appointmentId).subscribe({
      next: (res) => {
        this.isClearingMaterials.set(false);
        if (res.isSuccess) {
          this._toast.addSuccessMessage(res.message || 'تم مسح المستلزمات بنجاح');
          this.loadAppointmentDetails(appointmentId);
        } else {
          this._toast.addErrorMessage(res.message || 'فشل في مسح المستلزمات');
        }
      },
      error: (err) => {
        this.isClearingMaterials.set(false);
        this._toast.addErrorMessage(err.error.message || 'حدث خطأ أثناء مسح المستلزمات');
      },
    });
  }

  /**
   * Fetches appointments for a specific doctor schedule ID via AppointmentApiService.getAppointmentsByScheduleId
   */
  loadAppointmentsByScheduleId(scheduleId: number): void {
    this.isLoadingScheduleAppointments.set(true);
    this.currentScheduleId.set(scheduleId);

    this._appointmentApiService.getAppointmentsByScheduleId(scheduleId).subscribe({
      next: (res) => {
        this.isLoadingScheduleAppointments.set(false);
        if (res.isSuccess && res.data) {
          this.scheduleAppointments.set(res.data);
        } else {
          this.scheduleAppointments.set([]);
          this._toast.addErrorMessage(res.message || 'فشل في جلب قائمة الحجوزات للموعد المحدد');
        }
      },
      error: (err) => {
        this.isLoadingScheduleAppointments.set(false);
        this.scheduleAppointments.set([]);
        this._toast.addErrorMessage(err.error.message || 'حدث خطأ أثناء جلب حجوزات الموعد');
      },
    });
  }

  /**
   * Status change action methods for individual appointments
   */
  payAppointment(id: number): void {
    this.actionLoadingId.set(id);
    this._appointmentApiService.payAppointment(id).subscribe({
      next: (res) => {
        this.actionLoadingId.set(null);
        if (res.isSuccess) {
          this._toast.addSuccessMessage(res.message || 'تم تحديث حالة الحجز إلى مدفوع بنجاح');
          const currSchedId = this.currentScheduleId();
          if (currSchedId) {
            this.loadAppointmentsByScheduleId(currSchedId);
          } else {
            this.refreshData();
          }
        } else {
          this._toast.addErrorMessage(res.message || 'فشل في تغيير حالة السداد');
        }
      },
      error: (err) => {
        this.actionLoadingId.set(null);
        this._toast.addErrorMessage(err.error.message || 'حدث خطأ أثناء تغيير حالة السداد');
      },
    });
  }

  completeAppointment(id: number): void {
    this.actionLoadingId.set(id);
    this._appointmentApiService.completeAppointment(id).subscribe({
      next: (res) => {
        this.actionLoadingId.set(null);
        if (res.isSuccess) {
          this._toast.addSuccessMessage(res.message || 'تم إكتمال الكشف والحجز بنجاح');
          const currSchedId = this.currentScheduleId();
          if (currSchedId) {
            this.loadAppointmentsByScheduleId(currSchedId);
          } else {
            this.refreshData();
          }
          if (this.todayAppointments().length > 0) {
            this.loadMyTodayAppointments();
          }
        } else {
          this._toast.addErrorMessage(res.message || 'فشل في إنهاء الموعد');
        }
      },
      error: (err) => {
        this.actionLoadingId.set(null);
        this._toast.addErrorMessage(err.error.message || 'حدث خطأ أثناء تحديث حالة الموعد');
      },
    });
  }

  /**
   * Fetch doctor's today appointments summary via AppointmentApiService.getMyTodayAppointmentsSummary
   */
  async loadMyTodayAppointments(): Promise<void> {
    this.isLoadingTodayAppointments.set(true);
    this._appointmentApiService.getMyTodayAppointmentsSummary().subscribe({
      next: (res) => {
        this.isLoadingTodayAppointments.set(false);
        if (res.isSuccess && res.data) {
          this.todayAppointments.set(res.data);
        } else {
          this.todayAppointments.set([]);
          this._toast.addErrorMessage(res.message || 'فشل في جلب قائمة مواعيد اليوم الخاصة بك');
        }
      },
      error: (err) => {
        this.isLoadingTodayAppointments.set(false);
        this.todayAppointments.set([]);
        this._toast.addErrorMessage(
          err.error.message || 'حدث خطأ أثناء تحميل مواعيد اليوم الخاصة بك',
        );
      },
    });
  }

  cancelAppointment(id: number): void {
    this.actionLoadingId.set(id);
    this._appointmentApiService.cancelAppointment(id).subscribe({
      next: (res) => {
        this.actionLoadingId.set(null);
        if (res.isSuccess) {
          this._toast.addSuccessMessage(res.message || 'تم إلغاء الحجز بنجاح');
          const currSchedId = this.currentScheduleId();
          if (currSchedId) {
            this.loadAppointmentsByScheduleId(currSchedId);
          } else {
            this.refreshData();
          }
        } else {
          this._toast.addErrorMessage(res.message || 'فشل في إلغاء الحجز');
        }
      },
      error: (err) => {
        this.actionLoadingId.set(null);
        this._toast.addErrorMessage(err.error.message || 'حدث خطأ أثناء إلغاء الحجز');
      },
    });
  }

  hardDeleteAppointment(id: number): void {
    this.actionLoadingId.set(id);
    this._appointmentApiService.hardDeleteAppointment(id).subscribe({
      next: (res) => {
        this.actionLoadingId.set(null);
        if (res.isSuccess) {
          this._toast.addSuccessMessage(res.message || 'تم حذف الحجز نهائياً بنجاح');
          const currSchedId = this.currentScheduleId();
          if (currSchedId) {
            this.loadAppointmentsByScheduleId(currSchedId);
          } else {
            this.refreshData();
          }
        } else {
          this._toast.addErrorMessage(res.message || 'فشل في حذف الحجز نهائياً');
        }
      },
      error: (err) => {
        this.actionLoadingId.set(null);
        this._toast.addErrorMessage(err.error.message || 'حدث خطأ أثناء الحذف النهائي للحجز');
      },
    });
  }
}
