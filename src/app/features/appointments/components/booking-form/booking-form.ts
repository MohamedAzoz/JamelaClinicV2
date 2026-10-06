import { Component, inject, output, signal, effect, computed, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  form,
  FormField,
  FormRoot,
  min,
  minLength,
  required,
  validate,
  disabled,
  pattern,
} from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
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
import { CreateAppointments } from '../../models/CreateAppointments';
import { VisitType } from '../../models/VisitType';
import { DatePipe } from '@angular/common';
import { getDiscountError, getDoctorShare, isValidMoney } from '../../utils/appointment-pricing';
import { AppointmentFeeBreakdownComponent } from '../appointment-fee-breakdown/appointment-fee-breakdown';

export interface BookingFormModel {
  doctorId: string;
  doctorScheduleId: string;
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  visitType: number | null;
  consultationFee: number;
  discountAmount: number;
  isPaid: boolean;
}

@Component({
  selector: 'app-booking-form',
  imports: [FormField, FormRoot, FontAwesomeModule, DatePipe, AppointmentFeeBreakdownComponent],
  templateUrl: './booking-form.html',
})
export class BookingFormComponent implements OnInit {
  readonly facade = inject(AppointmentFacade);
  private readonly _route = inject(ActivatedRoute);

  // Output for form values sync (for live summary card)
  readonly formValueChange = output<BookingFormModel>();

  // Pending schedule selection from queryParams
  readonly pendingScheduleId = signal<string | null>(null);

  // FontAwesome Icons
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

  // Visit Types Enum options
  readonly visitTypeOptions = [
    {
      value: VisitType.NewConsultation,
      label: 'كشف جديد',
      icon: 'faStethoscope',
      desc: 'معاينة وفحص أول مرة',
    },
    {
      value: VisitType.FollowUp,
      label: 'إعادة',
      icon: 'faCalendarCheck',
      desc: 'متابعة بعد الكشف',
    },
    // {
    //   value: VisitType.Sessions,
    //   label: 'جلسات',
    //   icon: 'faUserCheck',
    //   desc: 'جلسات متابعة مستمرة',
    // },
    // { value: VisitType.Laser, label: 'ليزر', icon: 'faCoins', desc: 'جلسات التجميل والليزر' },
    // {
    //   value: VisitType.Fractional,
    //   label: 'فراكشنال',
    //   icon: 'faCreditCard',
    //   desc: 'جلسات الجلدية والعناية',
    // },
  ];

  // Signal Form Model
  protected readonly _model = signal<BookingFormModel>({
    doctorId: '',
    doctorScheduleId: '',
    patientName: '',
    patientPhoneNumber: '',
    patientAddress: '',
    visitType: null,
    consultationFee: 0,
    discountAmount: 0,
    isPaid: false,
  });

  readonly model = this._model.asReadonly();
  readonly selectedDoctor = computed(() =>
    this.facade.doctors().find((doctor) => doctor.userId === this.model().doctorId),
  );
  readonly maxDiscount = computed(() => getDoctorShare(this.model().consultationFee, 70));

  readonly bookingForm = form(this._model, (path) => {
    required(path.doctorId, { message: 'يرجى اختيار الطبيب' });

    required(path.doctorScheduleId, { message: 'يرجى اختيار تاريخ وموعد الحجز' });
    disabled(
      path.doctorScheduleId,
      () => !this.facade.selectedDoctorId() || this.facade.isLoadingSchedules(),
    );

    required(path.patientName, { message: 'اسم المريض مطلوب' });
    minLength(path.patientName, 3, { message: 'اسم المريض يجب أن يتكون من 3 أحرف على الأقل' });

    required(path.patientPhoneNumber, { message: 'رقم هاتف المريض مطلوب' });
    //خلى بالك الرقم لازم 11
    pattern(path.patientPhoneNumber, /^(01[0125]{1}[0-9]{8})$/, {
      message: 'رقم الهاتف غير صحيح',
    });

    required(path.consultationFee, { message: 'قيمة الكشف / الحجز مطلوبة' });
    min(path.consultationFee, 0, { message: 'القيمة يجب أن تكون 0 أو أكثر' });
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
    // Notify parent / summary of form value updates whenever model changes
    effect(() => {
      const current = this._model();
      this.formValueChange.emit(current);
    });

    // Effect: Auto-select scheduleId when facade.schedules() are loaded and match pendingScheduleId
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
    this._route.queryParams.subscribe((params) => {
      const docId = params['doctorId'];
      const schedId = params['scheduleId'];

      if (schedId) {
        this.pendingScheduleId.set(String(schedId));
      }

      if (docId) {
        this._model.update((m) => ({
          ...m,
          doctorId: docId,
        }));
        this.facade.selectDoctor(docId);
      }
    });
  }

  onDoctorChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const doctorId = select.value;

    // Update model doctorId and clear doctorScheduleId
    this._model.update((m) => ({
      ...m,
      doctorId,
      doctorScheduleId: '',
    }));

    // Trigger facade doctor selection
    this.facade.selectDoctor(doctorId);
  }

  onScheduleChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this._model.update((m) => ({
      ...m,
      doctorScheduleId: select.value || '',
    }));
  }

  onVisitTypeSelect(type: VisitType): void {
    this._model.update((m) => ({
      ...m,
      visitType: type ?? null,
    }));
  }

  onPaidToggle(event: Event): void {
    const input = event.target as HTMLInputElement;
    this._model.update((m) => ({
      ...m,
      isPaid: input.checked,
    }));
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (this.bookingForm().invalid() || this.facade.isSubmitting()) {
      this.bookingForm().markAsTouched();
      return;
    }

    const val = this._model();

    if (!val.doctorScheduleId || Number(val.doctorScheduleId) <= 0) {
      return;
    }

    const payload: CreateAppointments = {
      patientName: val.patientName.trim(),
      patientPhoneNumber: val.patientPhoneNumber.trim(),
      patientAddress: val.patientAddress.trim(),
      visitType: val.visitType ?? null,
      doctorScheduleId: Number(val.doctorScheduleId),
      consultationFee: Number(val.consultationFee),
      discountAmount: val.discountAmount,
      isPaid: Boolean(val.isPaid),
    };

    const ok = await this.facade.createAppointment(payload);
    if (ok) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this._model.set({
      doctorId: '',
      doctorScheduleId: '',
      patientName: '',
      patientPhoneNumber: '',
      patientAddress: '',
      visitType: null,
      consultationFee: 0,
      discountAmount: 0,
      isPaid: false,
    });
    this.facade.selectedDoctorId.set('');
    this.facade.schedules.set([]);
  }
}
