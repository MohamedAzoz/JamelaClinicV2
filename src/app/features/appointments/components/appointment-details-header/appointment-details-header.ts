import { Component, computed, inject, input, signal } from '@angular/core';
import { Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowRight,
  faBan,
  faCheck,
  faCheckCircle,
  faCoins,
  faReceipt,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { AppointmentsMaterial } from '../../models/AppointmentsMaterial';
import { ConfirmDialogService } from '@shared/components/confirm-modal';
import { PayAppointmentModalComponent } from '../pay-appointment-modal/pay-appointment-modal';

@Component({
  selector: 'app-appointment-details-header',
  imports: [FontAwesomeModule, PayAppointmentModalComponent], 
  templateUrl: './appointment-details-header.html',
})
export class AppointmentDetailsHeaderComponent {
  readonly facade = inject(AppointmentFacade);
  private readonly _location = inject(Location);
  private readonly _confirmService = inject(ConfirmDialogService);

  readonly appointment = input.required<AppointmentsMaterial>();
  readonly Number = Number;

  /** Signal to control the pay modal — holds appointment data when open */
  readonly payingAppointment = signal<{ id: number; patientName: string; amount: number } | null>(null);

  readonly faArrowRight = faArrowRight;
  readonly faReceipt = faReceipt;
  readonly faCoins = faCoins;
  readonly faCheck = faCheck;
  readonly faBan = faBan;
  readonly faCheckCircle = faCheckCircle;
  readonly faSpinner = faSpinner;

  readonly statusBadgeClass = computed(() => {
    const status = this.appointment()?.status;
    switch (status) {
      case 'Unpaid':
        return 'bg-warning/10 text-warning border border-warning/20';
      case 'InProgress':
        return 'bg-accent/10 text-accent border border-accent/20';
      case 'Completed':
        return 'bg-success/10 text-success border border-success/20';
      case 'Cancelled':
        return 'bg-danger/10 text-danger border border-danger/20';
      default:
        return 'bg-warning/10 text-warning border border-warning/20';
    }
  });

  //"status": "Cancelled", //
  getStatusName(status: string | null | undefined): string {
    switch (status) {
      case 'Unpaid':
        return 'غير مدفوع';
      case 'InProgress':
        return 'قيد المعاينة';
      case 'Completed':
        return 'مكتمل';
      case 'Cancelled':
        return 'ملغى';
      default:
        return 'غير مدفوع';
    }
  }

  getStatus(status: string | null | undefined): number {
    switch (status) {
      case 'Unpaid':
        return 1;
      case 'InProgress':
        return 2;
      case 'Completed':
        return 3;
      case 'Cancelled':
        return 4;
      default:
        return 1;
    }
  }
  goBack(): void {
    this._location.back();
  }

  openPayModal(): void {
    const app = this.appointment();
    this.payingAppointment.set({
      id: app.id,
      patientName: app.patientName,
      amount: app.finalPaidAmount || app.consultationFee || 0,
    });
  }

  closePayModal(): void {
    this.payingAppointment.set(null);
  }

  async complete(): Promise<void> {
    const app = this.appointment();
    const confirmed = await this._confirmService.complete(
      'تأكيد إنهاء الكشف',
      `هل أنت تأكد من إتمام المعاينة وإنهاء الكشف للحجز رقم #${app.id} للمريض "${app.patientName}"؟`,
      [{ label: 'اسم المريض', value: app.patientName }],
    );
    if (confirmed) {
      this.facade.completeAppointment(app.id);
    }
  }

  async cancel(): Promise<void> {
    const app = this.appointment();
    const confirmed = await this._confirmService.confirm({
      variant: 'danger',
      title: 'تأكيد إلغاء الحجز',
      itemName: `حجز #${app.id} - ${app.patientName}`,
      message: `هل أنت تأكد من رغبتك في إلغاء الحجز للمريض "${app.patientName}"؟`,
      warningMessage:
        'تحذير: هذا الإجراء سيؤدي إلى تغيير حالة الحجز إلى ملغى ولا يمكن التراجع عنه.',
      confirmText: 'نعم، إلغاء الحجز',
      cancelText: 'تراجع',
    });
    if (confirmed) {
      this.facade.cancelAppointment(app.id);
    }
  }
}
