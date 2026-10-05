import { computed, inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, min, max, required } from '@angular/forms/signals';
import { finalize } from 'rxjs/operators';
import { AppMessageService } from '@core/services/app-message-service';
import { DoctorApiService } from './doctor-api.service';
import { ClinicApiService } from '../../clinics/services/clinic-api.service';
import { Doctor } from '../models/Doctor';
import { Clinic } from '../../clinics/models/Clinic';
import { DoctorClinicsResponse } from '../models/DoctorClinicsResponse';
import { AssignDoctorClinics } from '../models/AssignDoctorClinics';
import { UpdateDoctorClinics } from '../models/UpdateDoctorClinics';

interface AssignClinicFormModel {
  clinicId: string;
  doctorPercentage: number;
}

interface UpdateClinicFormModel {
  doctorPercentage: number;
  isActive: boolean;
}

@Service()
export class DoctorClinicsFacade {
  private _doctorApiService = inject(DoctorApiService);
  private _clinicApiService = inject(ClinicApiService);
  private _messageService = inject(AppMessageService);
  private _router = inject(Router);

  // ─── State ───────────────────────────────────────────────────────────────
  readonly doctorId = signal<string>('');
  readonly doctor = signal<Doctor | null>(null);
  readonly doctorClinics = signal<DoctorClinicsResponse[]>([]);
  readonly clinics = signal<Clinic[]>([]);
  readonly loading = signal<boolean>(false);
  readonly actionLoading = signal<boolean>(false);

  // ─── Modal State ──────────────────────────────────────────────────────────
  readonly isAssignModalOpen = signal<boolean>(false);
  readonly isEditModalOpen = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly selectedClinicForEdit = signal<DoctorClinicsResponse | null>(null);
  readonly selectedClinicForDelete = signal<DoctorClinicsResponse | null>(null);

  // ─── Computed ─────────────────────────────────────────────────────────────
  readonly unassignedClinics = computed(() => {
    const assignedIds = new Set(this.doctorClinics().map((dc) => dc.clinicId));
    return this.clinics().filter((c) => !assignedIds.has(c.id));
  });

  // ─── Assign Form ──────────────────────────────────────────────────────────
  private readonly _assignModel = signal<AssignClinicFormModel>({
    clinicId: '',
    doctorPercentage: 70,
  });

  readonly assignForm = form(this._assignModel, (path) => {
    required(path.clinicId, { message: 'يرجى اختيار العيادة' });
    required(path.doctorPercentage, { message: 'نسبة الطبيب مطلوبة' });
    min(path.doctorPercentage, 0, { message: 'النسبة لا يمكن أن تكون أقل من 0%' });
    max(path.doctorPercentage, 100, { message: 'النسبة لا يمكن أن تتجاوز 100%' });
  });

  // ─── Edit Form ────────────────────────────────────────────────────────────
  private readonly _updateModel = signal<UpdateClinicFormModel>({
    doctorPercentage: 70,
    isActive: true,
  });

  readonly updateForm = form(this._updateModel, (path) => {
    required(path.doctorPercentage, { message: 'نسبة الطبيب مطلوبة' });
    min(path.doctorPercentage, 0, { message: 'النسبة لا يمكن أن تكون أقل من 0%' });
    max(path.doctorPercentage, 100, { message: 'النسبة لا يمكن أن تتجاوز 100%' });
  });

  // ─── Data Loading ─────────────────────────────────────────────────────────
  initPage(doctorId: string): void {
    this.doctorId.set(doctorId);
    this.loading.set(true);

    this._doctorApiService.getDoctorById(doctorId).subscribe({
      next: (res) => {
        if (res?.isSuccess && res.data) {
          this.doctor.set(res.data);
        }
      },
    });

    this._clinicApiService.getClinics().subscribe({
      next: (res) => {
        if (res?.isSuccess && Array.isArray(res.data)) {
          this.clinics.set(res.data);
        }
      },
    });

    this.loadDoctorClinics(doctorId);
  }

  loadDoctorClinics(doctorId: string): void {
    this.loading.set(true);
    this._doctorApiService
      .getDoctorClinicsByDoctorId(doctorId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess && Array.isArray(res.data)) {
            this.doctorClinics.set(res.data);
          } else {
            this.doctorClinics.set(Array.isArray(res?.data) ? res.data : []);
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(
            err?.error?.message || 'تعذر تحميل عيادات الطبيب',
          );
        },
      });
  }

  navigateBack(): void {
    this._router.navigate(['/main/doctors']);
  }

  // ─── Assign Modal ─────────────────────────────────────────────────────────
  openAssignModal(): void {
    this._assignModel.set({ clinicId: '', doctorPercentage: 70 });
    this.isAssignModalOpen.set(true);
  }

  closeAssignModal(): void {
    this.isAssignModalOpen.set(false);
  }

  submitAssign(event?: Event): void {
    if (event) event.preventDefault();

    if (this.assignForm().invalid()) {
      this.assignForm().markAsTouched();
      return;
    }

    const val = this._assignModel();
    const request: AssignDoctorClinics = {
      doctorId: this.doctorId(),
      clinicId: Number(val.clinicId),
      doctorPercentage: Number(val.doctorPercentage),
    };

    this.actionLoading.set(true);
    this._doctorApiService
      .assign(request)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            this._messageService.addSuccessMessage('تم إسناد العيادة وتحديد النسبة بنجاح');
            this.closeAssignModal();
            this.loadDoctorClinics(this.doctorId());
          } else {
            this._messageService.addErrorMessage(res?.message || 'فشلت عملية إسناد العيادة');
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(
            err?.error?.message || 'حدث خطأ أثناء إسناد العيادة',
          );
        },
      });
  }

  // ─── Edit Modal ───────────────────────────────────────────────────────────
  openEditModal(item: DoctorClinicsResponse): void {
    this.selectedClinicForEdit.set(item);
    this._updateModel.set({
      doctorPercentage: item.doctorPercentage,
      isActive: item.isActive,
    });
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedClinicForEdit.set(null);
  }

  submitUpdate(event?: Event): void {
    if (event) event.preventDefault();

    if (this.updateForm().invalid()) {
      this.updateForm().markAsTouched();
      return;
    }

    const selected = this.selectedClinicForEdit();
    if (!selected) return;

    const val = this._updateModel();
    const request: UpdateDoctorClinics = {
      doctorPercentage: Number(val.doctorPercentage),
      isActive: val.isActive,
    };

    this.actionLoading.set(true);
    this._doctorApiService
      .updateAssign(selected.id, request)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            this._messageService.addSuccessMessage('تم تحديث نسبة العيادة وحالتها بنجاح');
            this.closeEditModal();
            this.loadDoctorClinics(this.doctorId());
          } else {
            this._messageService.addErrorMessage(res?.message || 'حدث خطأ أثناء التحديث');
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(
            err?.error?.message || 'فشلت عملية التحديث',
          );
        },
      });
  }

  // ─── Delete Modal ─────────────────────────────────────────────────────────
  openDeleteModal(item: DoctorClinicsResponse): void {
    this.selectedClinicForDelete.set(item);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.selectedClinicForDelete.set(null);
  }

  confirmDelete(): void {
    const selected = this.selectedClinicForDelete();
    if (!selected) return;

    this.actionLoading.set(true);
    this._doctorApiService
      .deleteDoctorClinics(selected.doctorId, selected.clinicId)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            this._messageService.addSuccessMessage('تم إلغاء إسناد العيادة بنجاح');
            this.closeDeleteModal();
            this.loadDoctorClinics(this.doctorId());
          } else {
            this._messageService.addErrorMessage(res?.message || 'فشلت عملية الغاء الإسناد');
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(
            err?.error?.message || 'حدث خطأ أثناء إلغاء الإسناد',
          );
        },
      });
  }
}
