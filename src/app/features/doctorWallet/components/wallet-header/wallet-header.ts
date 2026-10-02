import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWallet, faPlus, faArrowUp, faRotate } from '@fortawesome/free-solid-svg-icons';
import { DoctorWalletFacade } from '../../services/doctor-wallet.facade';
import { WalletTransactionType } from '@features/doctorWallet/models/WalletTransactionType';

@Component({
  selector: 'app-wallet-header',
  imports: [FontAwesomeModule],
  template: `
    <header
      class="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-primary/20 bg-surface p-6 shadow-sm "
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-xl text-primary"
        >
          <fa-icon [icon]="faWallet" />
        </div>
        <div>
          <h1 id="wallet-heading" tabindex="-1" class="text-xl font-bold text-text sm:text-2xl">
            {{ facade.isDoctor() ? 'حسابي المالي' : 'الحسابات المالية للأطباء' }}
          </h1>
          <p class="mt-1 text-sm text-text-muted">
            {{
              facade.isDoctor()
                ? 'متابعة رصيدي وحركات حسابي المالي'
                : 'متابعة الأرصدة والإيداعات والسحوبات في مكان واحد'
            }}
          </p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          (click)="facade.refreshData()"
          [disabled]="facade.loading()"
          class="inline-flex min-h-10 items-center gap-2 rounded-xl border border-primary/20 bg-surface px-3 py-2 text-sm font-semibold text-text disabled:opacity-50"
        >
          <fa-icon [icon]="faRotate" [class.animate-spin]="facade.loading()" /> تحديث
        </button>
        @if (facade.canManage()) {
          <button
            type="button"
            (click)="facade.openTransaction(WalletTransactionType.Deposit)"
            class="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark"
          >
            <fa-icon [icon]="faPlus" /> إضافة رصيد
          </button>
          <button
            type="button"
            (click)="facade.openTransaction(WalletTransactionType.Withdrawal)"
            class="inline-flex min-h-10 items-center gap-2 rounded-xl border border-danger/30 bg-surface px-4 py-2 text-sm font-bold text-text transition hover:bg-danger/10"
          >
            <fa-icon [icon]="faArrowUp" /> سحب رصيد
          </button>
        }
      </div>
    </header>
  `,
})
export class WalletHeaderComponent {
  readonly facade = inject(DoctorWalletFacade);
  readonly faWallet = faWallet;
  readonly faPlus = faPlus;
  readonly faArrowUp = faArrowUp;
  readonly faRotate = faRotate;
  readonly WalletTransactionType = WalletTransactionType;
}
