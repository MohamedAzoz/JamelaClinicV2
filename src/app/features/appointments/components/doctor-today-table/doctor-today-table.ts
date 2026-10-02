import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheck,
  faCheckCircle,
  faClock,
  faEye,
  faFilter,
  faReceipt,
  faSearch,
  faSpinner,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { AppointmentStatus } from '../../models/AppointmentStatus';
import { VisitType } from '../../models/VisitType';
import { TodayAppointment } from '../../models/AppointmentsMaterial';

import { ConfirmDialogService } from '@shared/components/confirm-modal';

@Component({
  selector: 'app-doctor-today-table',
  imports: [FontAwesomeModule, DatePipe],
  templateUrl: './doctor-today-table.html',
})
export class DoctorTodayTableComponent {
  readonly facade = inject(AppointmentFacade);
  private readonly _router = inject(Router);
  private readonly _confirmService = inject(ConfirmDialogService);

  readonly Number = Number;
  readonly AppointmentStatusEnum = AppointmentStatus;

  // Icons
  readonly faUser = faUser;
  readonly faCheck = faCheck;
  readonly faCheckCircle = faCheckCircle;
  readonly faClock = faClock;
  readonly faEye = faEye;
  readonly faSearch = faSearch;
  readonly faFilter = faFilter;
  readonly faSpinner = faSpinner;
  readonly faReceipt = faReceipt;

  readonly searchQuery = signal<string>('');
  readonly statusFilter = signal<number | null>(null);

  readonly filteredAppointments = computed(() => {
    let list = this.facade.todayAppointments();
    const query = this.searchQuery().trim().toLowerCase();
    const status = this.statusFilter();

    if (query) {
      list = list.filter((a) => a.patientName?.toLowerCase().includes(query));
    }

    if (status !== null) {
      list = list.filter((a) => Number(a.status) === Number(status));
    }

    return list;
  });

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  onStatusFilterChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.statusFilter.set(val ? Number(val) : null);
  }

  async complete(app: TodayAppointment): Promise<void> {
    const confirmed = await this._confirmService.complete(
      'تأكيد إنهاء الكشف',
      `هل أنت تأكد من إتمام المعاينة وإنهاء الكشف للحجز رقم #${app.id} للمريض "${app.patientName}"؟`,
      [
        { label: 'اسم المريض', value: app.patientName },
        { label: 'رقم الدور', value: `#${app.queueNumber}` },
      ]
    );
    if (confirmed) {
      this.facade.completeAppointment(app.id);
    }
  }

  viewDetails(id: number): void {
    this._router.navigate(['/main/appointment-details', id]);
  }

  getVisitTypeName(type: VisitType | number | string | null | undefined): string {
    switch (Number(type)) {
      case VisitType.NewConsultation:
        return 'كشف جديد';
      case VisitType.FollowUp:
        return 'إعادة';
      case VisitType.Sessions:
        return 'جلسات';
      case VisitType.Laser:
        return 'ليزر';
      case VisitType.Fractional:
        return 'فراكشنال';
      default:
        return 'كشف';
    }
  }

  getStatusName(status: AppointmentStatus | number | string | null | undefined): string {
    switch (Number(status)) {
      case AppointmentStatus.Unpaid:
        return 'غير مدفوع';
      case AppointmentStatus.InProgress:
        return 'قيد المعاينة';
      case AppointmentStatus.Completed:
        return 'مكتمل';
      case AppointmentStatus.Cancelleted:
        return 'ملغى';
      default:
        return 'غير مدفوع';
    }
  }

  getStatusBadgeClass(status: AppointmentStatus | number | string | null | undefined): string {
    const num = Number(status);
    switch (num) {
      case AppointmentStatus.Unpaid:
        return 'bg-warning/10 text-warning border border-warning/20';
      case AppointmentStatus.InProgress:
        return 'bg-accent/10 text-accent border border-accent/20';
      case AppointmentStatus.Completed:
        return 'bg-success/10 text-success border border-success/20';
      case AppointmentStatus.Cancelleted:
        return 'bg-danger/10 text-danger border border-danger/20';
      default:
        return 'bg-warning/10 text-warning border border-warning/20';
    }
  }
}
