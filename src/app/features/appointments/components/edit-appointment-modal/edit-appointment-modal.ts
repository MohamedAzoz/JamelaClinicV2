import { Component, computed, inject, input, output, effect, signal, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  form,
  FormField,
  FormRoot,
  min,
  minLength,
  required,
  disabled,
  pattern,
  validate,
} from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEdit,
  faTimes,
  faUser,
  faPhone,
  faMapMarkerAlt,
  faUserMd,
  faCalendarDay,
  faMoneyBillWave,
  faCheckCircle,
  faSpinner,
  faStethoscope,
  faCoins,
  faCreditCard,
  faCalendarCheck,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { Appointments } from '../../models/Appointments';
import { AppointmentUpdate } from '../../models/AppointmentUpdate';
import { Doctor } from '@features/doctors/models/Doctor';
import { getDiscountError, getDoctorShare, isValidMoney } from '../../utils/appointment-pricing';
import { AppointmentFeeBreakdownComponent } from '../appointment-fee-breakdown/appointment-fee-breakdown';

export interface EditAppointmentFormModel {
  doctorId: string;
  doctorScheduleId: string;
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  doctorClinicId: number;
  consultationFee: number;
  discountAmount: number;
}

@Component({
  selector: 'app-edit-appointment-modal',
  imports: [FormField, FormRoot, FontAwesomeModule, DecimalPipe, AppointmentFeeBreakdownComponent],
  templateUrl: './edit-appointment-modal.html',
})
export class EditAppointmentModalComponent implements OnInit {
  readonly facade = inject(AppointmentFacade);

  readonly appointment = input.required<Appointments>();
  readonly closed = output<void>();

  // FontAwesome Icons
  readonly faEdit = faEdit;
  readonly faTimes = faTimes;
  readonly faUser = faUser;
  readonly faPhone = faPhone;
  readonly faMapMarkerAlt = faMapMarkerAlt;
  readonly faUserMd = faUserMd;
  readonly faCalendarDay = faCalendarDay;
  readonly faMoneyBillWave = faMoneyBillWave;
  readonly faCheckCircle = faCheckCircle;
  readonly faSpinner = faSpinner;
  readonly faStethoscope = faStethoscope;
  readonly faCoins = faCoins;
  readonly faCreditCard = faCreditCard;
  readonly faCalendarCheck = faCalendarCheck;
  readonly faChevronDown = faChevronDown;

  readonly pendingScheduleId = signal<string | null>(null);

  protected readonly _model = signal<EditAppointmentFormModel>({
    doctorId: '',
    doctorScheduleId: '',
    patientName: '',
    patientPhoneNumber: '',
    patientAddress: '',
    doctorClinicId: 0,
    consultationFee: 0,
    discountAmount: 0,
  });

  readonly model = this._model.asReadonly();
  readonly selectedDoctor = computed(() =>
    this.facade.doctors().find((doctor) => doctor.userId === this.model().doctorId),
  );
  readonly maxDiscount = computed(() => getDoctorShare(this.model().consultationFee, 70));

  readonly editForm = form(this._model, (path) => {
    required(path.doctorId, { message: 'يرجى اختيار الطبيب' });

    required(path.doctorScheduleId, { message: 'يرجى اختيار تاريخ وموعد الحجز' });
    disabled(
      path.doctorScheduleId,
      () => !this.facade.selectedDoctorId() || this.facade.isLoadingSchedules(),
    );

    required(path.patientName, { message: 'اسم المريض مطلوب' });
    minLength(path.patientName, 3, { message: 'اسم المريض يجب أن يتكون من 3 أحرف على الأقل' });

    required(path.patientPhoneNumber, { message: 'رقم هاتف المريض مطلوب' });
    pattern(path.patientPhoneNumber, /^(01[0125]{1}[0-9]{8})$/, {
      message: 'رقم الهاتف غير صحيح',
    });

    required(path.consultationFee, { message: 'قيمة الكشف / الحجز مطلوبة' });
    min(path.consultationFee, 0, { message: 'القيمة يجب أن تكون أكثر من 0' });
    validate(path.consultationFee, ({ value }) =>
      isValidMoney(value())
        ? null
        : {
            kind: 'money',
            message: 'أدخل قيمة كشف صحيحة بحد أقصى منزلتان عشريتان',
          },
    );
    validate(path.discountAmount, ({ value }) => {
      const message = getDiscountError(this.model().consultationFee, value(), 70);
      return message ? { kind: 'discount', message } : null;
    });
  });

  constructor() {
    // 1. Auto-select doctor when doctors list becomes available
    effect(() => {
      const docs = this.facade.doctors();
      const app = this.appointment();
      const currentDoctorId = this._model().doctorId;

      if (docs.length > 0 && !currentDoctorId && app) {
        const matchedDoctorId = this.matchDoctorId(app.doctorName, docs);
        if (matchedDoctorId) {
          this._model.update((m) => ({ ...m, doctorId: matchedDoctorId }));
          this.facade.selectDoctor(matchedDoctorId);
        }
      }
    });

    // 2. Auto-select schedule when schedules list becomes available
    effect(() => {
      const scheds = this.facade.schedules();
      const pendingSchedId = this.pendingScheduleId();

      if (pendingSchedId && scheds.length > 0) {
        const matchingSchedule = scheds.find((s) => String(s.id) === String(pendingSchedId));
        if (matchingSchedule) {
          this._model.update((m) => ({
            ...m,
            doctorScheduleId: String(matchingSchedule.id),
          }));
          this.pendingScheduleId.set(null);
        }
      }
    });
  }

  ngOnInit(): void {
    const app = this.appointment();

    // Ensure active doctors list is loaded
    if (this.facade.doctors().length === 0) {
      this.facade.loadActiveDoctors();
    }

    const doctorId = this.matchDoctorId(app.doctorName, this.facade.doctors());
    this.pendingScheduleId.set(String(app.doctorScheduleId));

    this._model.set({
      doctorId,
      doctorScheduleId: String(app.doctorScheduleId),
      patientName: app.patientName || '',
      patientPhoneNumber: app.patientPhoneNumber || '',
      patientAddress: app.patientAddress || '',
      doctorClinicId: 0,
      consultationFee: app.consultationFee ?? 0,
      discountAmount: app.discountAmount ?? 0,
    });

    if (doctorId) {
      this.facade.selectDoctor(doctorId);
    }
  }

  private matchDoctorId(doctorName: string | undefined, doctors: Doctor[]): string {
    if (!doctorName || doctors.length === 0) return '';
    const cleanAppDoc = doctorName
      .replace(/^د[\.\/]?\s*/, '')
      .trim()
      .toLowerCase();

    const matched = doctors.filter((d) => {
      const cleanDoc = d.fullName
        .replace(/^د[\.\/]?\s*/, '')
        .trim()
        .toLowerCase();
      return cleanDoc === cleanAppDoc;
    });

    return matched.length === 1 ? matched[0].userId : '';
  }

  onDoctorChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const doctorId = select.value;
    this._model.update((m) => ({ ...m, doctorId, doctorScheduleId: '' }));
    this.facade.selectDoctor(doctorId);
  }

  onScheduleChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this._model.update((m) => ({ ...m, doctorScheduleId: select.value || '' }));
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (this.editForm().invalid() || this.facade.isUpdating()) {
      this.editForm().markAsTouched();
      return;
    }

    const val = this._model();
    const app = this.appointment();

    const payload: AppointmentUpdate = {
      id: app.id,
      patientName: val.patientName.trim(),
      patientPhoneNumber: val.patientPhoneNumber.trim(),
      patientAddress: val.patientAddress.trim(),
      doctorClinicId: val.doctorClinicId,
      doctorScheduleId: Number(val.doctorScheduleId),
      consultationFee: Number(val.consultationFee),
      discountAmount: val.discountAmount,
    };

    const ok = await this.facade.updateAppointment(payload);
    if (ok) {
      this.closed.emit();
    }
  }

  close(): void {
    this.closed.emit();
  }
}
