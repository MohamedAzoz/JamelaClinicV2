import { Component, effect, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, max, min, minLength, required } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUserMd,
  faXmark,
  faCheck,
  faSpinner,
  faLock,
  faUser,
  faHospital,
  faPercent,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorFacade } from '../../services/doctor.facade';
import { UpdateDoctorRequest } from '../../models/UpdateDoctorRequest';
import { RegisterDoctorRequest } from '@features/auth/models/RegisterDoctorRequest';

interface DoctorFormModel {
  fullName: string;
  username: string;
  password: string;
  clinicId: string;
  doctorPercentage: number;
  isActive: boolean;
}

@Component({
  selector: 'app-doctor-form-modal',
  imports: [FormField, FormRoot, FontAwesomeModule],
  templateUrl: './doctor-form-modal.html',
})
export class DoctorFormModalComponent {
  public facade = inject(DoctorFacade);

  readonly faUserMd = faUserMd;
  readonly faXmark = faXmark;
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;
  readonly faLock = faLock;
  readonly faUser = faUser;
  readonly faHospital = faHospital;
  readonly faPercent = faPercent;

  private readonly _model = signal<DoctorFormModel>({
    fullName: '',
    username: '',
    password: '',
    clinicId: '',
    doctorPercentage: 70,
    isActive: true,
  });

  readonly doctorForm = form(this._model, (path) => {
    required(path.fullName, { message: 'اسم الطبيب مطلوب' });
    minLength(path.fullName, 3, { message: 'يجب أن يكون الاسم 3 أحرف على الأقل' });

    required(path.clinicId, { message: 'يرجى اختيار العيادة' });

    required(path.username, {
      when: () => !this.facade.selectedDoctor(),
      message: 'اسم المستخدم مطلوب',
    });
    minLength(path.username, 3, {
      when: () => !this.facade.selectedDoctor(),
      message: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل',
    });

    required(path.password, {
      when: () => !this.facade.selectedDoctor(),
      message: 'كلمة المرور مطلوبة',
    });
    minLength(path.password, 6, {
      when: () => !this.facade.selectedDoctor(),
      message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    });

    required(path.doctorPercentage, {
      when: () => !!this.facade.selectedDoctor(),
      message: 'نسبة الطبيب مطلوبة',
    });
    min(path.doctorPercentage, 0, {
      when: () => !!this.facade.selectedDoctor(),
      message: 'النسبة لا يمكن أن تكون أقل من 0',
    });
    max(path.doctorPercentage, 100, {
      when: () => !!this.facade.selectedDoctor(),
      message: 'النسبة لا يمكن أن تتجاوز 100',
    });
  });

  constructor() {
    effect(() => {
      const selected = this.facade.selectedDoctor();
      if (selected) {
        this._model.set({
          fullName: selected.fullName,
          username: '',
          password: '',
          clinicId: selected.clinicId ? String(selected.clinicId) : '',
          doctorPercentage: selected.doctorPercentage ?? 70,
          isActive: selected.isActive,
        });
      } else {
        this._model.set({
          fullName: '',
          username: '',
          password: '',
          clinicId: '',
          doctorPercentage: 70,
          isActive: true,
        });
      }
    });
  }

  onSubmit(event?: Event): void {
    if (event) event.preventDefault();

    if (this.doctorForm().invalid()) {
      this.doctorForm().markAsTouched();
      return;
    }

    const selected = this.facade.selectedDoctor();
    const val = this._model();

    if (selected) {
      const request: UpdateDoctorRequest = {
        userId: selected.userId,
        fullName: val.fullName,
        clinicId: Number(val.clinicId),
        doctorPercentage: Number(val.doctorPercentage),
        isActive: val.isActive,
      };
      this.facade.updateDoctor(request);
    } else {
      const request: RegisterDoctorRequest = {
        fullName: val.fullName,
        username: val.username,
        password: val.password,
        clinicId: Number(val.clinicId),
      };
      this.facade.registerDoctor(request);
    }
  }

  close(): void {
    this.facade.closeFormModal();
  }
}

