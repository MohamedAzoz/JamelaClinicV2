import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBolt,
  faCalendarDay,
  faClipboardList,
  faCoins,
  faCreditCard,
  faMapMarkerAlt,
  faMobileScreenButton,
  faPhone,
  faQuestionCircle,
  faUser,
  faUserMd,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentsMaterial } from '../../models/AppointmentsMaterial';
import { PaymentMethod } from '../../models/PaymentMethod';

@Component({
  selector: 'app-appointment-patient-info',
  imports: [FontAwesomeModule, DatePipe],
  templateUrl: './appointment-patient-info.html',
})
export class AppointmentPatientInfoComponent {
  readonly appointment = input.required<AppointmentsMaterial>();

  readonly faUser = faUser;
  readonly faPhone = faPhone;
  readonly faMapMarkerAlt = faMapMarkerAlt;
  readonly faUserMd = faUserMd;
  readonly faCalendarDay = faCalendarDay;
  readonly faClipboardList = faClipboardList;
  readonly faCreditCard = faCreditCard;

  readonly paymentMethodDetails = computed(() => {
    const method = this.appointment()?.paymentMethod;
    switch (Number(method)) {
      case PaymentMethod.Cash:
        return {
          name: 'نقداً',
          icon: faCoins,
          badgeClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
          emoji: '💵',
        };
      case PaymentMethod.VodafoneCash:
        return {
          name: 'فودافون كاش',
          icon: faMobileScreenButton,
          badgeClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
          emoji: '📱',
        };
      case PaymentMethod.InstaPay:
        return {
          name: 'إنستا باي',
          icon: faBolt,
          badgeClass: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
          emoji: '⚡',
        };
      default:
        return {
          name: 'غير محدد بعد',
          icon: faQuestionCircle,
          badgeClass: 'text-text-muted bg-text-muted/10 border-primary/10',
          emoji: '💳',
        };
    }
  });

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
}
