import { Component, computed, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBolt,
  faCoins,
  faCreditCard,
  faMobileScreenButton,
  faQuestionCircle,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { AppointmentsMaterial } from '../../models/AppointmentsMaterial';
import { PaymentMethod } from '../../models/PaymentMethod';

@Component({
  selector: 'app-appointment-financial-summary',
  imports: [FontAwesomeModule, DecimalPipe],
  templateUrl: './appointment-financial-summary.html',
})
export class AppointmentFinancialSummaryComponent {
  readonly facade = inject(AppointmentFacade);
  readonly appointment = input.required<AppointmentsMaterial>();

  readonly faWallet = faWallet;
  readonly faCreditCard = faCreditCard;

  readonly totalMaterialsCost = computed(
    () => this.appointment()?.totalMaterialsCost ?? 0,
  );

  readonly paymentMethodDetails = computed(() => {
    const method = this.appointment()?.paymentMethod;
    switch (Number(method)) {
      case PaymentMethod.Cash:
        return {
          name: 'نقداً',
          subtext: 'Cash',
          icon: faCoins,
          badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
          emoji: '💵',
        };
      case PaymentMethod.VodafoneCash:
        return {
          name: 'فودافون كاش',
          subtext: 'Vodafone Cash',
          icon: faMobileScreenButton,
          badgeClass: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
          emoji: '📱',
        };
      case PaymentMethod.InstaPay:
        return {
          name: 'إنستا باي',
          subtext: 'InstaPay',
          icon: faBolt,
          badgeClass: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
          emoji: '⚡',
        };
      default:
        return {
          name: 'غير محدد بعد',
          subtext: 'Not Specified',
          icon: faQuestionCircle,
          badgeClass: 'bg-text-muted/10 text-text-muted border-primary/10',
          emoji: '💳',
        };
    }
  });
}

