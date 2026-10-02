import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { form, FormField, min, required } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWallet, faXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ConfirmDialogService } from '@shared/components/confirm-modal';
import { DoctorWalletFacade, WalletActionTarget } from '../../services/doctor-wallet.facade';
import { WalletTransactionType } from '@features/doctorWallet/models/WalletTransactionType';

@Component({
  selector: 'app-wallet-transaction-modal',
  imports: [FormField, FontAwesomeModule],
  templateUrl: './wallet-transaction-modal.html',
})
export class WalletTransactionModalComponent implements OnDestroy {
  readonly facade = inject(DoctorWalletFacade);
  private readonly document = inject(DOCUMENT);

  readonly target = input.required<WalletActionTarget>();
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private previousFocus: HTMLElement | null = null;

  readonly faWallet = faWallet;
  readonly faXmark = faXmark;
  readonly faSpinner = faSpinner;

  readonly isDeposit = computed(() => this.target().action === WalletTransactionType.Deposit);
  readonly model = linkedSignal(() => ({
    doctorId: this.target().doctorId,
    amount: 0,
    description: '',
  }));

  readonly transactionForm = form(this.model, (path) => {
    required(path.doctorId, { message: 'اختر الطبيب' });
    min(path.amount, 0.01, { message: 'أدخل مبلغًا أكبر من صفر' });
    required(path.description, { message: 'أدخل وصف العملية' });
  });

  constructor() {
    afterNextRender(() => {
      const active = this.document.activeElement;
      this.previousFocus = active instanceof HTMLElement ? active : null;
      this.dialog().nativeElement.showModal();
    });
  }

  cancel(event: Event): void {
    event.preventDefault();
    this.facade.closeTransaction();
  }

  async submit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.transactionForm().invalid() || this.facade.actionLoading()) {
      this.transactionForm().markAsTouched();
      return;
    }

    await this.facade.submitTransaction(this.model());
  }

  ngOnDestroy(): void {
    this.dialog().nativeElement.close();
    const focusTarget = this.previousFocus?.isConnected
      ? this.previousFocus
      : this.document.getElementById('wallet-heading');
    focusTarget?.focus();
  }
}
