import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faReceipt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-wallet-transaction-details-header',
  imports: [FontAwesomeModule],
  template: `
    <div
      class="rounded-3xl border border-primary/20 bg-surface p-6 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      dir="rtl"
    >
      <div class="flex items-center gap-4">
        <button
          type="button"
          (click)="back()"
          class="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-main-bg text-text hover:bg-primary/10 transition cursor-pointer"
          title="الرجوع للخلف"
        >
          <fa-icon [icon]="faArrowRight" class="text-base"></fa-icon>
        </button>
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"
        >
          <fa-icon [icon]="faReceipt" class="text-lg" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-text sm:text-2xl">تفاصيل الحركة المالية</h1>
          <p class="mt-1 text-sm text-text-muted">مراجعة بيانات المعاملة وتفاصيلها المرتبطة</p>
        </div>
      </div>
    </div>
  `,
})
export class WalletTransactionDetailsHeaderComponent {
  readonly location = inject(Location);
  readonly faArrowRight = faArrowRight;
  readonly faReceipt = faReceipt;

  back(): void {
    this.location.back();
  }
}
