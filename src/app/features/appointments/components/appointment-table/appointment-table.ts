import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faPhone,
  faMapMarkerAlt,
  faUserMd,
  faCalendarDay,
  faCoins,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faClock,
  faReceipt,
  faEdit,
  faEye,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { Router } from '@angular/router';
import { AppointmentStatus } from '../../models/AppointmentStatus';
import { Appointments } from '../../models/Appointments';
import { EditAppointmentModalComponent } from '../edit-appointment-modal/edit-appointment-modal';
import { ConfirmDialogService } from '@shared/components/confirm-modal';

@Component({
  selector: 'app-appointment-table',
  imports: [FontAwesomeModule, DatePipe, EditAppointmentModalComponent],
  templateUrl: './appointment-table.html',
})
export class AppointmentTableComponent {
  readonly facade = inject(AppointmentFacade);
  private readonly _router = inject(Router);
  private readonly _confirmService = inject(ConfirmDialogService);

  readonly Number = Number;

  readonly editingAppointment = signal<Appointments | null>(null);

  // FontAwesome Icons
  readonly faUser = faUser;
  readonly faPhone = faPhone;
  readonly faMapMarkerAlt = faMapMarkerAlt;
  readonly faUserMd = faUserMd;
  readonly faCalendarDay = faCalendarDay;
  readonly faCoins = faCoins;
  readonly faCheckCircle = faCheckCircle;
  readonly faTimesCircle = faTimesCircle;
  readonly faSpinner = faSpinner;
  readonly faClock = faClock;
  readonly faReceipt = faReceipt;
  readonly faEdit = faEdit;
  readonly faEye = faEye;
  readonly faTrash = faTrash;

  openEditModal(app: Appointments): void {
    this.facade.selectedDoctorId.set('');
    this.facade.schedules.set([]);
    this.editingAppointment.set(app);
  }

  closeEditModal(): void {
    this.editingAppointment.set(null);
  }

  openDetailsModal(app: Appointments): void {
    this._router.navigate(['/main/appointment-details', app.id]);
  }

  async hardDeleteAppointment(app: Appointments): Promise<void> {
    const confirmed = await this._confirmService.confirm({
      variant: 'danger',
      title: 'حذف الحجز نهائياً',
      itemName: `حجز #${app.id} - ${app.patientName}`,
      message: `هل أنت متأكد من الحذف النهائي للحجز الملغى رقم #${app.id} للمريض "${app.patientName}"؟`,
      warningMessage:
        'تحذير: هذا الإجراء حذف نهائي لا يمكن التراجع عنه. سيتم مسح الحجز من قاعدة البيانات تماماً.',
      confirmText: 'نعم، حذف نهائياً',
      cancelText: 'تراجع',
    });
    if (confirmed) {
      this.facade.hardDeleteAppointment(app.id);
    }
  }
  getStatusName(status: AppointmentStatus | number): string {
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

  getStatusBadgeClass(status: AppointmentStatus | number): string {
    const num = Number(status);
    switch (num) {
      case AppointmentStatus.Unpaid: // Confirmed - primary blue
        return 'bg-primary/10 text-primary border border-primary/20';
      case AppointmentStatus.InProgress: // InProgress - accent
        return 'bg-accent/10 text-accent border border-accent/20';
      case AppointmentStatus.Completed: // Completed - success
        return 'bg-success/10 text-success border border-success/20';
      case AppointmentStatus.Cancelleted: // Cancelled - danger
        return 'bg-danger/10 text-danger border border-danger/20';
      default:
        return 'bg-primary/10 text-primary border border-primary/20';
    }
  }
}
