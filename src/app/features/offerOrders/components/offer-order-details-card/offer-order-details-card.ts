import { Component, computed, inject, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBuilding,
  faCalendarDays,
  faCheckCircle,
  faClock,
  faCoins,
  faCreditCard,
  faFileLines,
  faHashtag,
  faReceipt,
  faUserTie,
  faWallet,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { OfferOrder } from '../../models/OfferOrder';
import { OfferOrdersFacade } from '../../services/offer-orders.facade';

@Component({
  selector: 'app-offer-order-details-card',
  imports: [DatePipe, DecimalPipe, RouterLink, FontAwesomeModule],
  templateUrl: './offer-order-details-card.html',
})
export class OfferOrderDetailsCardComponent {
  readonly facade = inject(OfferOrdersFacade);

  readonly order = input.required<OfferOrder>();

  readonly faBuilding = faBuilding;
  readonly faCalendarDays = faCalendarDays;
  readonly faCheckCircle = faCheckCircle;
  readonly faClock = faClock;
  readonly faCoins = faCoins;
  readonly faCreditCard = faCreditCard;
  readonly faFileLines = faFileLines;
  readonly faHashtag = faHashtag;
  readonly faReceipt = faReceipt;
  readonly faUserTie = faUserTie;
  readonly faWallet = faWallet;
  readonly faExclamationTriangle = faExclamationTriangle;

  readonly isFullyPaid = computed(() => (this.order().remainingAmount ?? 0) <= 0);
  readonly isPartiallyPaid = computed(
    () => (this.order().paidAmount ?? 0) > 0 && (this.order().remainingAmount ?? 0) > 0,
  );

  readonly statusLabel = computed(() => {
    if (this.isFullyPaid()) return 'مكتمل الدفع';
    if (this.isPartiallyPaid()) return 'مدفوع جزئياً';
    return 'غير مدفوع';
  });

  readonly statusClass = computed(() => {
    if (this.isFullyPaid())
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    if (this.isPartiallyPaid())
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    return 'bg-danger/10 text-danger border-danger/20';
  });

  readonly paidPercentage = computed(() => {
    const total = this.order().totalAmount || 0;
    if (total <= 0) return 0;
    const paid = this.order().paidAmount || 0;
    return Math.min(100, Math.max(0, (paid / total) * 100));
  });

  openPayModal(): void {
    this.facade.openPayModal(this.order());
  }
}
