import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarDays,
  faCheck,
  faCheckCircle,
  faCoins,
  faClock,
  faPen,
  faPlus,
  faSpinner,
  faTrash,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { PaymentMethod } from '@features/appointments/models/PaymentMethod';
import { CreateSpecialOfferResponse } from '../../models/CreateSpecialOfferResponse';
import { SpecialOffersFacade } from '../../services/special-offers.facade';

import { ConfirmModalComponent } from '@shared/components/confirm-modal';

@Component({
  selector: 'app-special-offer-details-view',
  imports: [DatePipe, DecimalPipe, FontAwesomeModule, ConfirmModalComponent],
  templateUrl: './special-offer-details-view.html',
})
export class SpecialOfferDetailsViewComponent {
  readonly facade = inject(SpecialOffersFacade);
  readonly offer = input.required<CreateSpecialOfferResponse>();
  readonly bookings = computed(() => this.facade.bookingReport()?.bookings ?? []);
  readonly totalBookings = computed(
    () => this.facade.bookingReport()?.totalBookingsCount ?? this.bookings().length,
  );
  readonly redeemedBookings = computed(
    () => this.bookings().filter((booking) => booking.isRedeemed).length,
  );
  readonly pendingBookings = computed(
    () => this.bookings().filter((booking) => !booking.isRedeemed).length,
  );
  readonly totalRevenue = computed(() => this.facade.bookingReport()?.totalRevenue ?? 0);
  readonly faCalendarDays = faCalendarDays;
  readonly faCheck = faCheck;
  readonly faCheckCircle = faCheckCircle;
  readonly faCoins = faCoins;
  readonly faClock = faClock;
  readonly faPen = faPen;
  readonly faPlus = faPlus;
  readonly faSpinner = faSpinner;
  readonly faTrash = faTrash;
  readonly faUser = faUser;
  readonly faUsers = faUsers;

  getPaymentMethodBadge(method: PaymentMethod | number) {
    switch (Number(method)) {
      case PaymentMethod.Cash:
        return {
          label: 'نقداً',
          class: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
          emoji: '💵',
        };
      case PaymentMethod.VodafoneCash:
        return {
          label: 'فودافون كاش',
          class: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
          emoji: '📱',
        };
      case PaymentMethod.InstaPay:
        return {
          label: 'إنستا باي',
          class: 'bg-violet-500/10 text-violet-500 border border-violet-500/20',
          emoji: '⚡',
        };
      default:
        return {
          label: 'غير محدد',
          class: 'bg-text-muted/10 text-text-muted border border-text-muted/20',
          emoji: '💳',
        };
    }
  }
}
