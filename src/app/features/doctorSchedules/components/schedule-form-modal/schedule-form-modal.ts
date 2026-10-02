import { Component, effect, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarPlus,
  faCalendarDays,
  faXmark,
  faCheck,
  faSpinner,
  faUserMd,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorScheduleFacade } from '../../services/doctor-schedule.facade';

interface ScheduleFormModel {
  date: string;
}

@Component({
  selector: 'app-schedule-form-modal',
  imports: [FormField, FormRoot, FontAwesomeModule],
  templateUrl: './schedule-form-modal.html',
})
export class ScheduleFormModalComponent {
  public facade = inject(DoctorScheduleFacade);

  readonly faCalendarPlus = faCalendarPlus;
  readonly faCalendarDays = faCalendarDays;
  readonly faXmark = faXmark;
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;
  readonly faUserMd = faUserMd;

  private readonly _model = signal<ScheduleFormModel>({
    date: '',
  });

  readonly scheduleForm = form(this._model, (path) => {
    required(path.date, { message: 'يرجى اختيار تاريخ الموعد' });
  });

  constructor() {
    effect(() => {
      const selected = this.facade.selectedSchedule();
      if (selected) {
        // Format ISO date or Date object to YYYY-MM-DD for date input
        const dateStr = this.formatDateForInput(selected.date);
        this._model.set({ date: dateStr });
      } else {
        // Default to today's date in YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        this._model.set({ date: today });
      }
    });
  }

  private formatDateForInput(rawDate: Date | string): string {
    if (!rawDate) return '';
    if (typeof rawDate === 'string') {
      return rawDate.split('T')[0];
    }
    const d = new Date(rawDate);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  onSubmit(event?: Event): void {
    if (event) event.preventDefault();

    if (this.scheduleForm().invalid()) {
      this.scheduleForm().markAsTouched();
      return;
    }

    const val = this._model();
    const selected = this.facade.selectedSchedule();

    if (selected) {
      this.facade.updateSchedule(selected.id, val.date);
    } else {
      this.facade.createSchedule(val.date);
    }
  }

  close(): void {
    this.facade.closeFormModal();
  }
}
